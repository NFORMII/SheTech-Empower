# mentor/views.py

from rest_framework import generics, permissions
from .models import Mentor
from .serializers import MentorSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class MentorListView(generics.ListAPIView):
    queryset = Mentor.objects.all()
    serializer_class = MentorSerializer
    permission_classes = [permissions.AllowAny]  # Adjust if needed

class MentorDetailView(generics.RetrieveAPIView):
    queryset = Mentor.objects.all()
    serializer_class = MentorSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "id"

    
class CurrentMentorView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != "youth":
            return Response({"detail": "Only youth users have assigned mentors."}, status=400)

        if not user.mentor:
            return Response({"detail": "No mentor assigned."}, status=404)

        try:
            mentor = user.mentor.mentor_profile
            
        except Mentor.DoesNotExist:
            return Response({"detail": "Mentor profile not found."}, status=404)

        serializer = MentorSerializer(mentor, context={'request': request})
        return Response(serializer.data)

