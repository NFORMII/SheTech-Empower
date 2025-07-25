from rest_framework import serializers
from .models import MicrograntApplication, SuccessStory

class MicrograntApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MicrograntApplication
        fields = '__all__'
        read_only_fields = ['user', 'submission_date']

class SuccessStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SuccessStory
        fields = '__all__'
        read_only_fields = ['user', 'status', 'created_at']
        
    def create(self, validated_data):
        user = self.context['request'].user
        if not validated_data.get('name'):
            validated_data['name'] = user.get_full_name() or user.username
        return super().create({**validated_data, 'user': user})