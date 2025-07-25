# stories/serializers.py
from rest_framework import serializers
from .models import Story

class StorySerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = Story
        fields = ['id', 'author', 'content', 'category', 'image', 'anonymous', 'created_at']

    def get_author(self, obj):
        return obj.author_display()


