from django.conf import settings
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path, re_path
from django.views.static import serve

admin.site.site_header = "ReBAT Backend"
admin.site.site_title = "ReBAT Backend"
admin.site.index_title = "Website data"

def index(request):
    return JsonResponse({"service": "ReBAT website backend", "api": "/api/", "health": "/api/health/"})


urlpatterns = [
    path("", index),
    path("django-admin/", admin.site.urls),
    path("api/", include("core.urls")),
    # Uploaded images are served straight from Django — the site's upload
    # volume is small enough that a separate media server isn't worth it.
    re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
]
