from rest_framework import generics, permissions
from .models import MicrograntApplication, SuccessStory
from .serializers import MicrograntApplicationSerializer, SuccessStorySerializer

class MicrograntApplicationListCreateView(generics.ListCreateAPIView):
    serializer_class = MicrograntApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MicrograntApplication.objects.filter(user=self.request.user).order_by('-submission_date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MicrograntApplicationRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = MicrograntApplication.objects.all()
    serializer_class = MicrograntApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow the user to access their own application
        return MicrograntApplication.objects.filter(user=self.request.user)
    

class SuccessStoryListCreateView(generics.ListCreateAPIView):
    serializer_class = SuccessStorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return SuccessStory.objects.filter(status="approved").order_by("-id")

    def perform_create(self, serializer):
        user = self.request.user
        name = self.request.data.get("name")
        if not name:
            name = user.get_full_name() or user.username
        serializer.save(user=user, name=name)