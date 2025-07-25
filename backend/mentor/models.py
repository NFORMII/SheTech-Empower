# mentor/models.py

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Mentor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='mentor_profile')
    role = models.CharField(max_length=100)
    expertise = models.JSONField(default=list)  # List of strings
    image = models.ImageField(upload_to='mentors/', null=True, blank=True)
    rating = models.FloatField(default=0.0)
    available = models.BooleanField(default=True)

    def __str__(self):
        return self.user.full_name
    

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_mentor_profile(sender, instance, created, **kwargs):
    if created and instance.role == "mentor":
        Mentor.objects.get_or_create(user=instance)

