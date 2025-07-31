# stories/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Story(models.Model):
    CATEGORY_CHOICES = [
        ('healing', 'Healing'),
        ('hope', 'Hope'),
        ('growth', 'Growth'),
        ('business', 'Business Idea'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stories')
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    image = models.ImageField(upload_to='story_images/', blank=True, null=True)
    anonymous = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def author_display(self):
        return "Anonymous" if self.anonymous else self.user.full_name
