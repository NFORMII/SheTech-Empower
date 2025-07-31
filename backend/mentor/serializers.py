# mentor/serializers.py

from rest_framework import serializers
from .models import Mentor
from django.contrib.auth import get_user_model

User = get_user_model()

class MentorSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)
    social_links = serializers.JSONField(default=dict)
    image = serializers.ImageField(required=False, allow_null=True)

    image_url = serializers.SerializerMethodField()


    class Meta:
        model = Mentor
        exclude = ['id', 'user']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None