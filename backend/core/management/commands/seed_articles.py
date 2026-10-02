import datetime
import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand

from core.models import Article

DEFAULT_FILE = Path(settings.BASE_DIR) / "seed" / "articles.json"


class Command(BaseCommand):
    help = "Loads the website's existing newsroom articles (seed/articles.json). Existing slugs are left untouched."

    def add_arguments(self, parser):
        parser.add_argument("--file", default=str(DEFAULT_FILE))

    def handle(self, *args, **options):
        items = json.loads(Path(options["file"]).read_text(encoding="utf-8"))
        created = 0
        for item in items:
            _, was_created = Article.objects.get_or_create(
                slug=item["slug"],
                defaults={
                    "title": item["title"],
                    "publish_date": datetime.date.fromisoformat(item["sortDate"]),
                    "author": item.get("author") or "ReBAT",
                    "category": item["category"],
                    "excerpt": item.get("excerpt", ""),
                    "body": item.get("body", []),
                    "image": item.get("image", ""),
                    "image_alt": item.get("imageAlt", ""),
                    "is_published": True,
                },
            )
            created += was_created
        self.stdout.write(self.style.SUCCESS(f"Seeded {created} new article(s); {len(items) - created} already existed."))
