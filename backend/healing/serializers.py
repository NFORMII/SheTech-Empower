# healing/serializers.py
from rest_framework import serializers
from .models import MoodCheckIn, JournalEntry, SupportReply, SupportPost

class MoodCheckInSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodCheckIn
        fields = ['id', 'mood', 'timestamp']

class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ['id', 'content', 'anonymous', 'timestamp']

class SupportReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportReply
        fields = ['id', 'content', 'created_at']

class SupportPostSerializer(serializers.ModelSerializer):
    replies = SupportReplySerializer(many=True, read_only=True)

    class Meta:
        model = SupportPost
        fields = ['id', 'content', 'anonymous', 'category', 'created_at', 'replies']