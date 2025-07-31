# healing/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, permissions
from .models import MoodCheckIn, SupportPost, SupportReply, JournalEntry
from .serializers import MoodCheckInSerializer, JournalEntrySerializer, SupportPostSerializer, SupportReplySerializer

class MoodCheckInView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = MoodCheckInSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class JournalEntryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = JournalEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def get(self, request):
        entries = JournalEntry.objects.filter(user=request.user).order_by('-timestamp')
        serializer = JournalEntrySerializer(entries, many=True)
        return Response(serializer.data)

class SupportPostListCreateView(generics.ListCreateAPIView):
    queryset = SupportPost.objects.all().order_by('-created_at')
    serializer_class = SupportPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SupportReplyCreateView(generics.CreateAPIView):
    queryset = SupportReply.objects.all()
    serializer_class = SupportReplySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = SupportPost.objects.get(id=post_id)
        serializer.save(user=self.request.user, post=post)