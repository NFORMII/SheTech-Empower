
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Youth(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='youth_profile')

    available = models.BooleanField(default=False)
    image = models.ImageField(upload_to='youths/', null=True, blank=True, default='image/default.png')


    expertise = models.JSONField(default=list, blank=True)
    age = models.IntegerField(null=True, blank=True)
    city_of_origin = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    interests = models.JSONField(default=list, blank=True)
    social_links = models.JSONField(default=dict, blank=True)

    displacement_date = models.DateField(null=True, blank=True)
    reason_for_displacement = models.TextField(blank=True)
    current_location = models.CharField(max_length=150, blank=True)
    immediate_needs = models.JSONField(default=list, blank=True)

    skills = models.JSONField(default=list, blank=True)
    aspirations = models.TextField(blank=True)
    family_members_count = models.IntegerField(null=True, blank=True)
    seeking_help = models.BooleanField(default=False)
    my_story = models.TextField(blank=True)

    specific_needs_goals = models.JSONField(default=list, blank=True)
    achievements_strengths = models.JSONField(default=list, blank=True)
    sponsorship_impact = models.TextField(blank=True)

    preferred_contact_method = models.CharField(max_length=100, blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    alternative_email = models.EmailField(blank=True)

    def __str__(self):
        return f"Youth Profile: {self.user.full_name}"

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_youth_profile(sender, instance, created, **kwargs):
    if created and instance.role == 'youth':
        Youth.objects.create(user=instance)
