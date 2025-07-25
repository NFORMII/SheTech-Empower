# mentor/urls.py

from django.urls import path
from .views import MentorListView, MentorDetailView, CurrentMentorView

urlpatterns = [
    path('', MentorListView.as_view(), name='mentor-list'),
    path('<int:id>/', MentorDetailView.as_view(), name='mentor-detail'),
    path('my/', CurrentMentorView.as_view(), name='current-mentor'),
]
