from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import User
from mentor.models import Mentor
from donor.models import Donor


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'role']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create(
            full_name=validated_data['full_name'],
            email=validated_data['email'],
            role=validated_data['role']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    



class MentorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mentor
        fields = ['role', 'expertise', 'rating', 'available']

class DonorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donor
        fields = ['role', 'expertise', 'rating', 'available']

