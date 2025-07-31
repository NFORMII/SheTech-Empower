# serializers.py
from rest_framework import serializers
from .models import Youth

class YouthSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)
    mentor = serializers.SerializerMethodField()
    social_links = serializers.JSONField(default=dict)
    image = serializers.ImageField(required=False, allow_null=True)

    image_url = serializers.SerializerMethodField()


    class Meta:
        model = Youth
        exclude = ['id', 'user']

    def get_mentor(self, obj):
        mentor = obj.user.mentor
        if mentor:
            return {
                "full_name": mentor.full_name,
                "email": mentor.email,
                "image": self.context['request'].build_absolute_uri(mentor.image.url) if mentor.image and self.context.get('request') else None
            }
        return None

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


