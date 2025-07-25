# stories/urls.py
from django.urls import path
from .views import StoryListCreateView

urlpatterns = [
    path('', StoryListCreateView.as_view(), name='story-list-create'),
]
