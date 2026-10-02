from django.db import models

# Mirrors NEWSROOM_CATEGORIES in the website's src/lib/content.ts.
NEWSROOM_CATEGORIES = [
    "Company Updates",
    "Announcements",
    "Industry News",
    "Milestones & Achievements",
    "Events & Activities",
    "New Developments",
    "Blogs",
]


class Enquiry(models.Model):
    """Every form on the website (contact page, enquiry modals, job
    applications) lands here, tagged with the topic and page it came from."""

    STATUS_NEW = "new"
    STATUS_CONTACTED = "contacted"
    STATUS_CLOSED = "closed"
    STATUS_CHOICES = [
        (STATUS_NEW, "New"),
        (STATUS_CONTACTED, "Contacted"),
        (STATUS_CLOSED, "Closed"),
    ]

    name = models.CharField(max_length=200)
    email = models.EmailField(max_length=254)
    phone = models.CharField(max_length=40, blank=True)
    company = models.CharField(max_length=200, blank=True)
    topic = models.CharField(max_length=200, blank=True, default="General")
    message = models.TextField(blank=True)
    source_page = models.CharField(max_length=300, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_NEW, db_index=True)
    admin_notes = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=400, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "enquiries"

    def __str__(self):
        return f"{self.name} - {self.topic}"


class Article(models.Model):
    """A Newsroom post. `body` keeps the website's own typed-block shape
    (p / h2 / list / faq / image / gallery) so the site renders it as-is."""

    slug = models.SlugField(max_length=200, unique=True)
    title = models.CharField(max_length=300)
    publish_date = models.DateField(db_index=True)
    author = models.CharField(max_length=120, default="ReBAT")
    category = models.CharField(max_length=60, choices=[(c, c) for c in NEWSROOM_CATEGORIES])
    excerpt = models.TextField(blank=True)
    body = models.JSONField(default=list, blank=True)
    image = models.CharField(max_length=500, blank=True)
    image_alt = models.CharField(max_length=300, blank=True)
    is_published = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-publish_date", "-id"]

    def __str__(self):
        return self.title

    @property
    def display_date(self):
        return self.publish_date.strftime("%d %b, %Y")


class Job(models.Model):
    EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"]

    title = models.CharField(max_length=200)
    department = models.CharField(max_length=120, blank=True)
    location = models.CharField(max_length=160, default="Mandideep, Madhya Pradesh")
    employment_type = models.CharField(
        max_length=40, choices=[(t, t) for t in EMPLOYMENT_TYPES], default="Full-time"
    )
    experience = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)
    responsibilities = models.JSONField(default=list, blank=True)
    requirements = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "-created_at"]

    def __str__(self):
        return self.title
