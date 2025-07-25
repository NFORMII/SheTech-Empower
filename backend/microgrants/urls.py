from django.urls import path
from .views import MicrograntApplicationListCreateView, MicrograntApplicationRetrieveUpdateView, SuccessStoryListCreateView

urlpatterns = [
    path('applications/', MicrograntApplicationListCreateView.as_view(), name='microgrant-list-create'),
    path('applications/<int:pk>/', MicrograntApplicationRetrieveUpdateView.as_view(), name='microgrant-detail-update'),
    path('success-stories/', SuccessStoryListCreateView.as_view(), name='success-story-list-create'),
]
