# learning/urls.py

from django.urls import path
from .views import (
    UserEnrollmentsView,
    UpdateProgressView,
    EnrollInCourseView,
    CompletedCoursesView,
)

urlpatterns = [
    path('enrollments/', UserEnrollmentsView.as_view(), name='user-enrollments'),
    path('enrollments/<int:pk>/update/', UpdateProgressView.as_view(), name='update-progress'),
    path('enroll/', EnrollInCourseView.as_view(), name='enroll-course'),
    path('achievements/', CompletedCoursesView.as_view(), name='completed-courses'),
]
