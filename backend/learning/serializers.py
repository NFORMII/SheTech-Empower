# learning/serializers.py

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Course, Enrollment

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'icon', 'color', 'modules', 'duration']


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer()
    certificate_url = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'progress', 'completed', 'certificate_earned', 'certificate_url']

    def get_certificate_url(self, obj):
        request = self.context.get('request')
        if obj.certificate_file and request:
            return request.build_absolute_uri(obj.certificate_file.url)
        return None


class EnrollmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['course']  # User is taken from request context

    def validate(self, attrs):
        user = self.context['request'].user
        course = attrs['course']
        if Enrollment.objects.filter(user=user, course=course).exists():
            raise ValidationError("You are already enrolled in this course.")
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        enrollment = Enrollment.objects.create(
            user=user,
            course=validated_data['course'],
            progress=0,
            completed=False,
            certificate_earned=False
        )
        return enrollment

    def to_representation(self, instance):
        # Return full EnrollmentSerializer data
        return EnrollmentSerializer(instance, context=self.context).data
