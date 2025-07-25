# learning/models.py

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    icon = models.CharField(max_length=100)  # e.g., 'LaptopIcon', 'CodeIcon'
    color = models.CharField(max_length=50)  # e.g., 'bg-blue-500'
    modules = models.IntegerField()
    duration = models.CharField(max_length=50)

    def __str__(self):
        return self.title


class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    progress = models.PositiveIntegerField(default=0)  # 0–100
    completed = models.BooleanField(default=False)
    certificate_earned = models.BooleanField(default=False)
    certificate_file = models.FileField(upload_to='certificates/', blank=True, null=True)

    class Meta:
        unique_together = ('user', 'course')
