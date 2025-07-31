from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer, UserSerializer
from .models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import User
from mentor.models import Mentor
from donor.models import Donor
from youth.models import Youth


from youth.serializers import YouthSerializer
from mentor.serializers import MentorSerializer
from donor.serializers import DonorSerializer


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    user = request.user

    # PATCH — Update profile
    if request.method == 'PATCH':
        if user.role == 'mentor':
            profile = get_object_or_404(Mentor, user=user)
            serializer = MentorSerializer(profile, data=request.data, partial=True)
            serializer.files = request.FILES
        elif user.role == 'donor':
            profile = get_object_or_404(Donor, user=user)
            serializer = DonorSerializer(profile, data=request.data, partial=True)
            serializer.files = request.FILES
        elif user.role == 'youth':
            profile = get_object_or_404(Youth, user=user)
            serializer = YouthSerializer(profile, data=request.data, partial=True)
            serializer.files = request.FILES
        else:
            return Response({"detail": "Profile update not allowed for this role."}, status=400)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    # GET — Retrieve profile
    base_data = {
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "image": None
    }

    if user.role == 'mentor':
        mentor = get_object_or_404(Mentor, user=user)
        base_data["image"] = mentor.image.url if mentor.image else None
        profile_data = MentorSerializer(mentor, context={'request': request}).data
        return Response({**base_data, **profile_data})

    elif user.role == 'donor':
        donor = get_object_or_404(Donor, user=user)
        base_data["image"] = donor.image.url if donor.image else None
        profile_data = DonorSerializer(donor, context={'request': request}).data
        return Response({**base_data, **profile_data})

    elif user.role == 'youth':
        youth = get_object_or_404(Youth, user=user)
        profile_data = YouthSerializer(youth, context={'request': request}).data
        return Response(profile_data)

    return Response(base_data)



@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": f"Unexpected error: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(request, email=email, password=password)
    if not user:
        return Response(
            {"error": "Invalid email or password."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        "token": token.key,
        "user": UserSerializer(user).data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        request.auth.delete()
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
    except AttributeError:
        return Response({"error": "No active token."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)
