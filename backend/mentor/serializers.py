# mentor/serializers.py

from rest_framework import serializers
from .models import Mentor
from django.contrib.auth import get_user_model

User = get_user_model()

class MentorSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    image = serializers.SerializerMethodField()  # override this

    class Meta:
        model = Mentor
        fields = ['id', 'full_name', 'email', 'role', 'expertise', 'image', 'rating', 'available']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else None