# mentor/models.py

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Mentor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='mentor_profile')
    expertise = models.JSONField(default=list)  # List of strings
    image = models.ImageField(upload_to='mentors/', null=True, blank=True)
    rating = models.FloatField(default=0.0)
    available = models.BooleanField(default=True)

    age = models.IntegerField(null=True, blank=True)
    city_of_origin = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    interests = models.JSONField(default=list, blank=True)
    social_links = models.JSONField(default=dict, blank=True)

    preferred_contact_method = models.CharField(max_length=100, blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    alternative_email = models.EmailField(blank=True)



    def __str__(self):
        return f"Mentor Profile: {self.user.full_name}"
    

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_mentor_profile(sender, instance, created, **kwargs):
    if created and instance.role == "mentor":
        Mentor.objects.get_or_create(user=instance)

