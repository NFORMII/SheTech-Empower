# dashboard/views.py
from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from healing.models import MoodCheckIn, JournalEntry
from learning.models import Enrollment
from microgrants.models import MicrograntApplication
# from notifications.models import Notification  # optional

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == 'youth':
            now = timezone.now()
            week_ago = now - timedelta(days=7)

            # Latest Mood
            latest_mood = MoodCheckIn.objects.filter(user=user).order_by("-timestamp").first()
            mood_data = {
                "label": latest_mood.mood if latest_mood else None,
                "emoji": self.get_mood_emoji(latest_mood.mood) if latest_mood else None,
            }

            # Journal
            journal_count = JournalEntry.objects.filter(user=user, timestamp__gte=week_ago).count()
            journal_goal = 5  # Optional: set a weekly target
            journal_progress_percent = min(int((journal_count / journal_goal) * 100), 100)

            # Course
            enrollments = Enrollment.objects.filter(user=user)
            course_title = enrollments.first().course.title if enrollments.exists() else "No course enrolled"
            avg_progress = round(sum(e.progress for e in enrollments) / len(enrollments)) if enrollments else 0

            # Microgrant
            microgrant = MicrograntApplication.objects.filter(user=user).first()

            # Mentorship placeholder
            mentorship_session_time = "Tomorrow, 2PM"  # Replace with real logic

            # Notifications
            notifications = [
                {
                    "message": "Welcome to your dashboard!",
                    "timestamp": now,
                }
            ]

            return Response({
                "name": user.first_name or user.username,
                "mood": mood_data,
                "journal_entries_this_week": journal_count,
                "journal_progress_percent": journal_progress_percent,
                "course_title": course_title,
                "course_progress_percent": avg_progress,
                "microgrant_status": microgrant.get_status_display() if microgrant else "Not Applied",
                "microgrant_progress_percent": microgrant.progress_percent if microgrant else 0,
                "mentorship_session_time": mentorship_session_time,
                "notifications": notifications,
            })

        else:
            return Response({})
        
    def get_mood_emoji(self, label):
        mood_map = {
            "Sad": {"emoji": "😢", "label": "Sad"},
            "Worried": {"emoji": "😕", "label": "Worried"},
            "Neutral": {"emoji": "😐", "label": "Neutral"},
            "Okay": {"emoji": "🙂", "label": "Okay"},
            "Happy": {"emoji": "😄", "label": "Happy"},
            "Peaceful": {"emoji": "😌", "label": "Peaceful"},
            "Frustrated": {"emoji": "😤", "label": "Frustrated"},
            "Anxious": {"emoji": "😰", "label": "Anxious"},
        }
        return mood_map.get(label, {"label": label, "emoji": "❓"})
