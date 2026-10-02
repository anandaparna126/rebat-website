import csv
import datetime
import functools
import json
import logging
import uuid
from pathlib import Path

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.core.files.storage import default_storage
from django.core.paginator import Paginator
from django.core.validators import validate_email
from django.db import IntegrityError
from django.db.models import Count, Q
from django.db.models.functions import TruncDate
from django.http import HttpResponse, JsonResponse
from django.utils import timezone
from django.utils.text import slugify
from django.views.decorators.csrf import csrf_exempt
from PIL import Image, UnidentifiedImageError

from .auth import admin_required, issue_tokens, user_from_token
from .models import NEWSROOM_CATEGORIES, Article, Enquiry, Job
from .serializers import (
    article_to_admin_dict,
    article_to_public_dict,
    enquiry_to_dict,
    job_to_dict,
    user_to_dict,
)

log = logging.getLogger(__name__)
User = get_user_model()

ARTICLE_BLOCK_TYPES = {"p", "h2", "list", "faq", "image", "gallery"}
ALLOWED_IMAGE_FORMATS = {"JPEG": "jpg", "PNG": "png", "WEBP": "webp", "GIF": "gif"}


# ─── helpers ──────────────────────────────────────────────────────────────


class BadRequest(Exception):
    pass


def api(*methods):
    """csrf-exempt JSON endpoint limited to `methods`, turning BadRequest
    into a 400 instead of a 500."""

    def decorator(fn):
        @csrf_exempt
        @functools.wraps(fn)
        def wrapper(request, *args, **kwargs):
            if request.method not in methods:
                return JsonResponse({"error": "Method not allowed."}, status=405)
            try:
                return fn(request, *args, **kwargs)
            except BadRequest as exc:
                return JsonResponse({"error": str(exc)}, status=400)

        return wrapper

    return decorator


def read_json(request):
    try:
        data = json.loads(request.body or b"{}")
    except (json.JSONDecodeError, UnicodeDecodeError):
        raise BadRequest("Request body must be valid JSON.")
    if not isinstance(data, dict):
        raise BadRequest("Request body must be a JSON object.")
    return data


def clean_str(data, key, max_len, required=False, label=None):
    value = data.get(key, "")
    if value is None:
        value = ""
    if not isinstance(value, str):
        raise BadRequest(f"{label or key} must be text.")
    value = value.strip()
    if required and not value:
        raise BadRequest(f"{label or key} is required.")
    if len(value) > max_len:
        raise BadRequest(f"{label or key} must be at most {max_len} characters.")
    return value


def clean_str_list(data, key, label):
    value = data.get(key) or []
    if not isinstance(value, list) or not all(isinstance(v, str) for v in value):
        raise BadRequest(f"{label} must be a list of text items.")
    return [v.strip() for v in value if v.strip()]


def client_ip(request):
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def rate_limited(key, limit, window_seconds):
    """Fixed-window counter; returns True once `limit` is exceeded."""
    added = cache.add(key, 1, window_seconds)
    if added:
        return False
    try:
        count = cache.incr(key)
    except ValueError:
        cache.set(key, 1, window_seconds)
        return False
    return count > limit


def paginate(request, queryset, to_dict):
    try:
        page_size = min(max(int(request.GET.get("page_size", 25)), 1), 200)
        page_number = max(int(request.GET.get("page", 1)), 1)
    except ValueError:
        raise BadRequest("page and page_size must be numbers.")
    paginator = Paginator(queryset, page_size)
    page = paginator.get_page(page_number)
    return {
        "results": [to_dict(obj) for obj in page.object_list],
        "count": paginator.count,
        "page": page.number,
        "num_pages": paginator.num_pages,
    }


# ─── public API (used by the website) ─────────────────────────────────────


@api("GET")
def health(request):
    return JsonResponse({"status": "ok", "time": timezone.now().isoformat()})


@api("POST")
def create_enquiry(request):
    data = read_json(request)

    # Honeypot: a hidden field real visitors never fill in.
    if data.get("website"):
        return JsonResponse({"ok": True}, status=201)

    ip = client_ip(request)
    if rate_limited(f"enquiry:{ip}", limit=8, window_seconds=600):
        return JsonResponse({"error": "Too many submissions. Please try again in a few minutes."}, status=429)

    name = clean_str(data, "name", 200, required=True, label="Name")
    email = clean_str(data, "email", 254, required=True, label="Email")
    try:
        validate_email(email)
    except ValidationError:
        raise BadRequest("Please enter a valid email address.")

    enquiry = Enquiry.objects.create(
        name=name,
        email=email,
        phone=clean_str(data, "phone", 40, label="Phone"),
        company=clean_str(data, "company", 200, label="Company"),
        topic=clean_str(data, "topic", 200, label="Topic") or "General",
        message=clean_str(data, "message", 5000, label="Message"),
        source_page=clean_str(data, "source_page", 300, label="Source page"),
        ip_address=ip,
        user_agent=request.headers.get("User-Agent", "")[:400],
    )
    log.info("New enquiry #%s (%s)", enquiry.id, enquiry.topic)
    return JsonResponse({"ok": True, "id": enquiry.id}, status=201)


@api("GET")
def public_articles(request):
    qs = Article.objects.filter(is_published=True)
    category = request.GET.get("category")
    if category:
        qs = qs.filter(category=category)
    return JsonResponse({"results": [article_to_public_dict(a) for a in qs]})


@api("GET")
def public_article_detail(request, slug):
    article = Article.objects.filter(is_published=True, slug=slug).first()
    if article is None:
        return JsonResponse({"error": "Not found."}, status=404)
    return JsonResponse(article_to_public_dict(article))


@api("GET")
def public_jobs(request):
    return JsonResponse({"results": [job_to_dict(j) for j in Job.objects.filter(is_active=True)]})


# ─── admin auth ───────────────────────────────────────────────────────────


@api("POST")
def admin_login(request):
    data = read_json(request)
    identifier = clean_str(data, "username", 254, required=True, label="Username")
    password = data.get("password") or ""
    if not isinstance(password, str) or not password:
        raise BadRequest("Password is required.")

    ip = client_ip(request)
    if rate_limited(f"login:{ip}", limit=10, window_seconds=900):
        return JsonResponse({"error": "Too many login attempts. Try again in 15 minutes."}, status=429)

    # Allow logging in with either the username or the account email.
    username = identifier
    if "@" in identifier:
        match = User.objects.filter(email__iexact=identifier).first()
        if match:
            username = match.get_username()

    user = authenticate(request, username=username, password=password)
    if user is None or not user.is_active or not user.is_staff:
        return JsonResponse({"error": "Invalid username or password."}, status=401)

    user.last_login = timezone.now()
    user.save(update_fields=["last_login"])
    return JsonResponse({**issue_tokens(user), "user": user_to_dict(user)})


@api("POST")
def admin_refresh(request):
    data = read_json(request)
    token = data.get("refresh")
    if not isinstance(token, str):
        raise BadRequest("refresh token is required.")
    user = user_from_token(token, "refresh")
    if user is None:
        return JsonResponse({"error": "Session expired. Please log in again."}, status=401)
    return JsonResponse({**issue_tokens(user), "user": user_to_dict(user)})


@api("GET", "PATCH")
@admin_required
def admin_me(request):
    user = request.admin_user
    if request.method == "PATCH":
        data = read_json(request)
        if "email" in data:
            email = clean_str(data, "email", 254, label="Email")
            if email:
                try:
                    validate_email(email)
                except ValidationError:
                    raise BadRequest("Please enter a valid email address.")
            user.email = email
        if "first_name" in data:
            user.first_name = clean_str(data, "first_name", 150, label="First name")
        if "last_name" in data:
            user.last_name = clean_str(data, "last_name", 150, label="Last name")
        user.save()
    return JsonResponse(user_to_dict(user))


@api("POST")
@admin_required
def admin_change_password(request):
    data = read_json(request)
    user = request.admin_user
    current = data.get("current_password") or ""
    new = data.get("new_password") or ""
    if not user.check_password(current):
        raise BadRequest("Current password is incorrect.")
    try:
        validate_password(new, user)
    except ValidationError as exc:
        raise BadRequest(" ".join(exc.messages))
    user.set_password(new)
    user.save()
    return JsonResponse({"ok": True})


# ─── admin dashboard ──────────────────────────────────────────────────────


@api("GET")
@admin_required
def admin_dashboard(request):
    now = timezone.now()
    week_ago = now - datetime.timedelta(days=7)
    since = (now - datetime.timedelta(days=13)).date()

    daily = {
        row["day"]: row["n"]
        for row in Enquiry.objects.filter(created_at__date__gte=since)
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(n=Count("id"))
    }
    timeline = []
    for offset in range(14):
        day = since + datetime.timedelta(days=offset)
        timeline.append({"date": day.isoformat(), "count": daily.get(day, 0)})

    by_topic = list(
        Enquiry.objects.values("topic").annotate(count=Count("id")).order_by("-count")[:8]
    )

    return JsonResponse(
        {
            "enquiries": {
                "total": Enquiry.objects.count(),
                "new": Enquiry.objects.filter(status=Enquiry.STATUS_NEW).count(),
                "contacted": Enquiry.objects.filter(status=Enquiry.STATUS_CONTACTED).count(),
                "closed": Enquiry.objects.filter(status=Enquiry.STATUS_CLOSED).count(),
                "last_7_days": Enquiry.objects.filter(created_at__gte=week_ago).count(),
            },
            "articles": {
                "published": Article.objects.filter(is_published=True).count(),
                "drafts": Article.objects.filter(is_published=False).count(),
            },
            "jobs": {
                "active": Job.objects.filter(is_active=True).count(),
                "inactive": Job.objects.filter(is_active=False).count(),
            },
            "timeline": timeline,
            "by_topic": by_topic,
            "recent_enquiries": [enquiry_to_dict(e) for e in Enquiry.objects.all()[:6]],
        }
    )


# ─── admin: enquiries ─────────────────────────────────────────────────────


def _filtered_enquiries(request):
    qs = Enquiry.objects.all()
    status = request.GET.get("status")
    if status:
        qs = qs.filter(status=status)
    topic = request.GET.get("topic")
    if topic:
        qs = qs.filter(topic=topic)
    q = (request.GET.get("q") or "").strip()
    if q:
        qs = qs.filter(
            Q(name__icontains=q)
            | Q(email__icontains=q)
            | Q(company__icontains=q)
            | Q(phone__icontains=q)
            | Q(message__icontains=q)
        )
    return qs


@api("GET")
@admin_required
def admin_enquiries(request):
    qs = _filtered_enquiries(request)
    if request.GET.get("export") == "csv":
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = (
            f'attachment; filename="rebat-enquiries-{timezone.localdate().isoformat()}.csv"'
        )
        writer = csv.writer(response)
        writer.writerow(["ID", "Date", "Name", "Email", "Phone", "Company", "Topic", "Message", "Page", "Status", "Notes"])
        for e in qs:
            writer.writerow(
                [
                    e.id,
                    timezone.localtime(e.created_at).strftime("%Y-%m-%d %H:%M"),
                    e.name,
                    e.email,
                    e.phone,
                    e.company,
                    e.topic,
                    e.message,
                    e.source_page,
                    e.get_status_display(),
                    e.admin_notes,
                ]
            )
        return response

    data = paginate(request, qs, enquiry_to_dict)
    data["topics"] = list(Enquiry.objects.order_by("topic").values_list("topic", flat=True).distinct())
    return JsonResponse(data)


@api("GET", "PATCH", "DELETE")
@admin_required
def admin_enquiry_detail(request, pk):
    enquiry = Enquiry.objects.filter(pk=pk).first()
    if enquiry is None:
        return JsonResponse({"error": "Not found."}, status=404)

    if request.method == "DELETE":
        enquiry.delete()
        return JsonResponse({"ok": True})

    if request.method == "PATCH":
        data = read_json(request)
        if "status" in data:
            if data["status"] not in dict(Enquiry.STATUS_CHOICES):
                raise BadRequest("Invalid status.")
            enquiry.status = data["status"]
        if "admin_notes" in data:
            enquiry.admin_notes = clean_str(data, "admin_notes", 5000, label="Notes")
        enquiry.save()

    return JsonResponse(enquiry_to_dict(enquiry))


# ─── admin: newsroom articles ─────────────────────────────────────────────


def _clean_body(body):
    if not isinstance(body, list):
        raise BadRequest("Body must be a list of blocks.")
    cleaned = []
    for i, block in enumerate(body, 1):
        if not isinstance(block, dict) or block.get("type") not in ARTICLE_BLOCK_TYPES:
            raise BadRequest(f"Block {i} has an unknown type.")
        kind = block["type"]
        if kind in ("p", "h2"):
            text = str(block.get("text") or "").strip()
            if text:
                cleaned.append({"type": kind, "text": text})
        elif kind == "list":
            items = [str(x).strip() for x in block.get("items") or [] if str(x).strip()]
            if items:
                cleaned.append({"type": "list", "items": items})
        elif kind == "faq":
            items = [
                {"q": str(x.get("q") or "").strip(), "a": str(x.get("a") or "").strip()}
                for x in block.get("items") or []
                if isinstance(x, dict) and str(x.get("q") or "").strip()
            ]
            if items:
                cleaned.append({"type": "faq", "items": items})
        elif kind == "image":
            src = str(block.get("src") or "").strip()
            if src:
                out = {"type": "image", "src": src, "alt": str(block.get("alt") or "").strip()}
                if block.get("caption"):
                    out["caption"] = str(block["caption"]).strip()
                cleaned.append(out)
        elif kind == "gallery":
            images = []
            for img in block.get("images") or []:
                if isinstance(img, dict) and str(img.get("src") or "").strip():
                    out = {"src": str(img["src"]).strip(), "alt": str(img.get("alt") or "").strip()}
                    if img.get("caption"):
                        out["caption"] = str(img["caption"]).strip()
                    images.append(out)
            if images:
                cleaned.append({"type": "gallery", "images": images})
    return cleaned


def _apply_article(article, data):
    article.title = clean_str(data, "title", 300, required=True, label="Title")
    slug = slugify(clean_str(data, "slug", 200, label="Slug") or article.title)[:200]
    if not slug:
        raise BadRequest("Slug could not be generated from the title.")
    if Article.objects.filter(slug=slug).exclude(pk=article.pk).exists():
        raise BadRequest(f"Another article already uses the slug '{slug}'.")
    article.slug = slug

    date_str = clean_str(data, "publish_date", 10, required=True, label="Publish date")
    try:
        article.publish_date = datetime.date.fromisoformat(date_str)
    except ValueError:
        raise BadRequest("Publish date must be YYYY-MM-DD.")

    category = clean_str(data, "category", 60, required=True, label="Category")
    if category not in NEWSROOM_CATEGORIES:
        raise BadRequest("Unknown category.")
    article.category = category
    article.author = clean_str(data, "author", 120, label="Author") or "ReBAT"
    article.excerpt = clean_str(data, "excerpt", 2000, label="Excerpt")
    article.image = clean_str(data, "image", 500, label="Image")
    article.image_alt = clean_str(data, "image_alt", 300, label="Image alt text")
    article.is_published = bool(data.get("is_published", True))
    article.body = _clean_body(data.get("body", []))
    try:
        article.save()
    except IntegrityError:
        raise BadRequest(f"Another article already uses the slug '{slug}'.")
    return article


@api("GET", "POST")
@admin_required
def admin_articles(request):
    if request.method == "POST":
        article = _apply_article(Article(), read_json(request))
        return JsonResponse(article_to_admin_dict(article), status=201)

    qs = Article.objects.all()
    category = request.GET.get("category")
    if category:
        qs = qs.filter(category=category)
    status = request.GET.get("status")
    if status == "published":
        qs = qs.filter(is_published=True)
    elif status == "draft":
        qs = qs.filter(is_published=False)
    q = (request.GET.get("q") or "").strip()
    if q:
        qs = qs.filter(Q(title__icontains=q) | Q(excerpt__icontains=q))
    data = paginate(request, qs, article_to_admin_dict)
    data["categories"] = NEWSROOM_CATEGORIES
    return JsonResponse(data)


@api("GET", "PUT", "DELETE")
@admin_required
def admin_article_detail(request, pk):
    article = Article.objects.filter(pk=pk).first()
    if article is None:
        return JsonResponse({"error": "Not found."}, status=404)
    if request.method == "DELETE":
        article.delete()
        return JsonResponse({"ok": True})
    if request.method == "PUT":
        _apply_article(article, read_json(request))
    return JsonResponse(article_to_admin_dict(article))


# ─── admin: jobs ──────────────────────────────────────────────────────────


def _apply_job(job, data):
    job.title = clean_str(data, "title", 200, required=True, label="Title")
    job.department = clean_str(data, "department", 120, label="Department")
    job.location = clean_str(data, "location", 160, label="Location") or "Mandideep, Madhya Pradesh"
    employment_type = clean_str(data, "employment_type", 40, label="Employment type") or "Full-time"
    if employment_type not in Job.EMPLOYMENT_TYPES:
        raise BadRequest("Unknown employment type.")
    job.employment_type = employment_type
    job.experience = clean_str(data, "experience", 120, label="Experience")
    job.description = clean_str(data, "description", 10000, label="Description")
    job.responsibilities = clean_str_list(data, "responsibilities", "Responsibilities")
    job.requirements = clean_str_list(data, "requirements", "Requirements")
    job.is_active = bool(data.get("is_active", True))
    try:
        job.sort_order = int(data.get("sort_order") or 0)
    except (TypeError, ValueError):
        raise BadRequest("Sort order must be a number.")
    job.save()
    return job


@api("GET", "POST")
@admin_required
def admin_jobs(request):
    if request.method == "POST":
        job = _apply_job(Job(), read_json(request))
        return JsonResponse(job_to_dict(job, admin=True), status=201)
    return JsonResponse(
        {
            "results": [job_to_dict(j, admin=True) for j in Job.objects.all()],
            "employment_types": Job.EMPLOYMENT_TYPES,
        }
    )


@api("GET", "PUT", "DELETE")
@admin_required
def admin_job_detail(request, pk):
    job = Job.objects.filter(pk=pk).first()
    if job is None:
        return JsonResponse({"error": "Not found."}, status=404)
    if request.method == "DELETE":
        job.delete()
        return JsonResponse({"ok": True})
    if request.method == "PUT":
        _apply_job(job, read_json(request))
    return JsonResponse(job_to_dict(job, admin=True))


# ─── admin: uploads ───────────────────────────────────────────────────────


@api("POST")
@admin_required
def admin_upload(request):
    upload = request.FILES.get("file")
    if upload is None:
        raise BadRequest("No file uploaded (expected form field 'file').")
    if upload.size > settings.MAX_UPLOAD_BYTES:
        raise BadRequest("Image must be 10 MB or smaller.")
    try:
        with Image.open(upload) as img:
            img.verify()
            fmt = img.format
    except (UnidentifiedImageError, OSError):
        raise BadRequest("That file isn't a valid image.")
    if fmt not in ALLOWED_IMAGE_FORMATS:
        raise BadRequest("Only JPG, PNG, WEBP and GIF images are allowed.")

    upload.seek(0)
    today = timezone.localdate()
    name = f"uploads/{today:%Y/%m}/{uuid.uuid4().hex}.{ALLOWED_IMAGE_FORMATS[fmt]}"
    saved = default_storage.save(name, upload)
    url = f"{settings.PUBLIC_BASE_URL}{settings.MEDIA_URL}{Path(saved).as_posix()}"
    return JsonResponse({"url": url}, status=201)


# ─── admin: admin users ───────────────────────────────────────────────────


@api("GET", "POST")
@admin_required(superuser=True)
def admin_users(request):
    if request.method == "POST":
        data = read_json(request)
        username = clean_str(data, "username", 150, required=True, label="Username")
        email = clean_str(data, "email", 254, label="Email")
        password = data.get("password") or ""
        if User.objects.filter(username__iexact=username).exists():
            raise BadRequest("That username is already taken.")
        if email:
            try:
                validate_email(email)
            except ValidationError:
                raise BadRequest("Please enter a valid email address.")
        user = User(
            username=username,
            email=email,
            first_name=clean_str(data, "first_name", 150, label="First name"),
            last_name=clean_str(data, "last_name", 150, label="Last name"),
            is_staff=True,
            is_superuser=bool(data.get("is_superuser")),
        )
        try:
            validate_password(password, user)
        except ValidationError as exc:
            raise BadRequest(" ".join(exc.messages))
        user.set_password(password)
        user.save()
        return JsonResponse(user_to_dict(user), status=201)

    users = User.objects.filter(is_staff=True).order_by("username")
    return JsonResponse({"results": [user_to_dict(u) for u in users]})


@api("PATCH", "DELETE")
@admin_required(superuser=True)
def admin_user_detail(request, pk):
    user = User.objects.filter(pk=pk, is_staff=True).first()
    if user is None:
        return JsonResponse({"error": "Not found."}, status=404)
    if user.pk == request.admin_user.pk:
        raise BadRequest("You can't change or remove your own account here.")

    if request.method == "DELETE":
        user.delete()
        return JsonResponse({"ok": True})

    data = read_json(request)
    if "is_active" in data:
        user.is_active = bool(data["is_active"])
    if "is_superuser" in data:
        user.is_superuser = bool(data["is_superuser"])
    if data.get("password"):
        try:
            validate_password(data["password"], user)
        except ValidationError as exc:
            raise BadRequest(" ".join(exc.messages))
        user.set_password(data["password"])
    user.save()
    return JsonResponse(user_to_dict(user))
