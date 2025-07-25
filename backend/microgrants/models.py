from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class MicrograntApplication(models.Model):
    STATUS_CHOICES = [
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('additional_info', 'Needs More Info'),
        ('funded', 'Funded'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='microgrant_applications')
    full_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    business_name = models.CharField(max_length=255)
    business_description = models.TextField()
    grant_amount = models.DecimalField(max_digits=7, decimal_places=2)
    budget_breakdown = models.TextField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='under_review')
    submission_date = models.DateField(auto_now_add=True)

    additional_info_required = models.TextField(blank=True, null=True)  # set by reviewer
    additional_info_response = models.TextField(blank=True, null=True)  # set by applicant

    last_updated = models.DateTimeField(auto_now=True)  # optional: to track updates

    def __str__(self):
        return f"{self.full_name} - {self.business_name}"
    
    @property
    def progress_percent(self):
        status_progress_map = {
            'under_review': 25,
            'additional_info': 50,
            'approved': 75,
            'funded': 100,
            'rejected': 100,  # Considered complete even if not successful
        }
        return status_progress_map.get(self.status, 0)


class SuccessStory(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='success_stories')
    name = models.CharField(max_length=255)
    business = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    story = models.TextField()
    image = models.ImageField(upload_to='success_story_images/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.business}"
