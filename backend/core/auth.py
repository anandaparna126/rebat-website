"""Stateless JWT auth for the admin panel (same scheme as Loomindica:
HS256 tokens signed with SECRET_KEY, short-lived access + longer refresh)."""

import datetime
import functools

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import JsonResponse


def _encode(user, token_type, lifetime):
    now = datetime.datetime.now(datetime.timezone.utc)
    payload = {
        "sub": str(user.pk),
        "type": token_type,
        "iat": now,
        "exp": now + lifetime,
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def issue_tokens(user):
    return {
        "access": _encode(user, "access", datetime.timedelta(minutes=settings.JWT_ACCESS_EXPIRY_MINUTES)),
        "refresh": _encode(user, "refresh", datetime.timedelta(days=settings.JWT_REFRESH_EXPIRY_DAYS)),
    }


def user_from_token(token, token_type):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except jwt.PyJWTError:
        return None
    if payload.get("type") != token_type:
        return None
    User = get_user_model()
    return User.objects.filter(pk=payload.get("sub"), is_active=True, is_staff=True).first()


def admin_required(view=None, *, superuser=False):
    """Rejects the request unless it carries a valid access token for an
    active staff user (and a superuser, when `superuser=True`)."""

    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(request, *args, **kwargs):
            header = request.headers.get("Authorization", "")
            if not header.startswith("Bearer "):
                return JsonResponse({"error": "Authentication required."}, status=401)
            user = user_from_token(header[7:], "access")
            if user is None:
                return JsonResponse({"error": "Session expired. Please log in again."}, status=401)
            if superuser and not user.is_superuser:
                return JsonResponse({"error": "Only a super admin can do this."}, status=403)
            request.admin_user = user
            return fn(request, *args, **kwargs)

        return wrapper

    return decorator(view) if view else decorator
