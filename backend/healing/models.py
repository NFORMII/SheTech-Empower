# healing/models.py
from django.db import models
from django.conf import settings

class MoodCheckIn(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    mood = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

class JournalEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    anonymous = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

class SupportPost(models.Model):
    CATEGORY_CHOICES = (
        ('healing', 'Healing'),
        ('growth', 'Growth'),
        ('trauma', 'Trauma'),
        ('tips', 'Tips'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    anonymous = models.BooleanField(default=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='healing')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {'Anonymous' if self.anonymous else self.user.full_name} - {self.created_at.date()}"
    
class SupportReply(models.Model):
    post = models.ForeignKey(SupportPost, on_delete=models.CASCADE, related_name='replies')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reply by {self.user.full_name}"