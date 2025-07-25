# healing/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import JournalEntry
from dashboard.models import Notification

@receiver(post_save, sender=JournalEntry)
def notify_journal_entry(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.user,
            message="You submitted a new journal entry."
        )
