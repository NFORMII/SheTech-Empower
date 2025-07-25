# microgrant/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import MicrograntApplication
from dashboard.models import Notification

@receiver(post_save, sender=MicrograntApplication)
def notify_user_on_microgrant_update(sender, instance, created, **kwargs):
    if not created:
        Notification.objects.create(
            user=instance.user,
            message=f"Your microgrant status has been updated to '{instance.status.replace('_', ' ').title()}'."
        )
