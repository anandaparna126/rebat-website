"""Plain-dict serializers — the API is small enough not to need DRF."""


def enquiry_to_dict(e):
    return {
        "id": e.id,
        "name": e.name,
        "email": e.email,
        "phone": e.phone,
        "company": e.company,
        "topic": e.topic,
        "message": e.message,
        "source_page": e.source_page,
        "status": e.status,
        "admin_notes": e.admin_notes,
        "ip_address": e.ip_address,
        "created_at": e.created_at.isoformat(),
        "updated_at": e.updated_at.isoformat(),
    }


def article_to_public_dict(a):
    """Matches the website's NewsroomArticle type exactly."""
    data = {
        "slug": a.slug,
        "title": a.title,
        "date": a.display_date,
        "sortDate": a.publish_date.isoformat(),
        "author": a.author,
        "category": a.category,
        "excerpt": a.excerpt,
        "body": a.body,
    }
    if a.image:
        data["image"] = a.image
        data["imageAlt"] = a.image_alt
    return data


def article_to_admin_dict(a):
    return {
        "id": a.id,
        "slug": a.slug,
        "title": a.title,
        "publish_date": a.publish_date.isoformat(),
        "display_date": a.display_date,
        "author": a.author,
        "category": a.category,
        "excerpt": a.excerpt,
        "body": a.body,
        "image": a.image,
        "image_alt": a.image_alt,
        "is_published": a.is_published,
        "created_at": a.created_at.isoformat(),
        "updated_at": a.updated_at.isoformat(),
    }


def job_to_dict(j, admin=False):
    data = {
        "id": j.id,
        "title": j.title,
        "department": j.department,
        "location": j.location,
        "employment_type": j.employment_type,
        "experience": j.experience,
        "description": j.description,
        "responsibilities": j.responsibilities,
        "requirements": j.requirements,
    }
    if admin:
        data.update(
            is_active=j.is_active,
            sort_order=j.sort_order,
            created_at=j.created_at.isoformat(),
            updated_at=j.updated_at.isoformat(),
        )
    return data


def user_to_dict(u):
    return {
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "first_name": u.first_name,
        "last_name": u.last_name,
        "is_superuser": u.is_superuser,
        "is_active": u.is_active,
        "last_login": u.last_login.isoformat() if u.last_login else None,
        "date_joined": u.date_joined.isoformat(),
    }
