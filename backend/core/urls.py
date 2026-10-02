from django.urls import path

from . import views

urlpatterns = [
    # Public — used by the website
    path("health/", views.health),
    path("enquiries/", views.create_enquiry),
    path("articles/", views.public_articles),
    path("articles/<slug:slug>/", views.public_article_detail),
    path("jobs/", views.public_jobs),
    # Admin panel
    path("admin/login/", views.admin_login),
    path("admin/refresh/", views.admin_refresh),
    path("admin/me/", views.admin_me),
    path("admin/change-password/", views.admin_change_password),
    path("admin/dashboard/", views.admin_dashboard),
    path("admin/enquiries/", views.admin_enquiries),
    path("admin/enquiries/<int:pk>/", views.admin_enquiry_detail),
    path("admin/articles/", views.admin_articles),
    path("admin/articles/<int:pk>/", views.admin_article_detail),
    path("admin/jobs/", views.admin_jobs),
    path("admin/jobs/<int:pk>/", views.admin_job_detail),
    path("admin/upload/", views.admin_upload),
    path("admin/users/", views.admin_users),
    path("admin/users/<int:pk>/", views.admin_user_detail),
]
