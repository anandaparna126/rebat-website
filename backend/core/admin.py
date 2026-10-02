from django.contrib import admin

from .models import Article, Enquiry, Job


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "topic", "status", "created_at")
    list_filter = ("status", "topic")
    search_fields = ("name", "email", "company", "message")


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "publish_date", "is_published")
    list_filter = ("category", "is_published")
    search_fields = ("title", "excerpt")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("title", "department", "location", "employment_type", "is_active")
    list_filter = ("is_active", "employment_type")
