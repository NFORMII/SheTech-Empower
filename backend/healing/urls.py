# healing/urls.py
from django.urls import path
from .views import MoodCheckInView, JournalEntryView, SupportPostListCreateView, SupportReplyCreateView

urlpatterns = [
    path('mood/checkin/', MoodCheckInView.as_view(), name='mood-checkin'),
    path('journal/entry/', JournalEntryView.as_view(), name='journal-entry'),
    path('support/posts/', SupportPostListCreateView.as_view(), name='support-posts'),
    path('support/posts/<int:post_id>/reply/', SupportReplyCreateView.as_view(), name='support-reply'),
]
