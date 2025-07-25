# stories/views.py
from rest_framework import generics, permissions
from .models import Story
from .serializers import StorySerializer

class StoryListCreateView(generics.ListCreateAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        category = self.request.query_params.get('category')
        if category and category != 'all':
            return Story.objects.filter(category=category).order_by('-created_at')
        return Story.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


