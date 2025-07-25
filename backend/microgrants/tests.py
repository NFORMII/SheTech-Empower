from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from .models import MicrograntApplication

User = get_user_model()

class MicrograntApplicationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email="testuser@email.com", password="testpass123")
        self.client.force_authenticate(user=self.user)

        self.valid_payload = {
            "full_name": "Jane Doe",
            "location": "Abuja",
            "business_name": "TailorXpress",
            "business_description": "Mobile tailoring for women in rural areas",
            "grant_amount": 450,
            "budget_breakdown": "Sewing machine - $300, materials - $150",
        }

    def test_create_microgrant_application(self):
        url = reverse("microgrant-list-create")  # ensure your URL name matches
        response = self.client.post(url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(MicrograntApplication.objects.count(), 1)
        self.assertEqual(MicrograntApplication.objects.first().user, self.user)

    def test_list_microgrant_applications(self):
        # Pre-create one application
        MicrograntApplication.objects.create(
            user=self.user,
            **self.valid_payload
        )
        url = reverse("microgrant-list-create")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['business_name'], "TailorXpress")

    def test_unauthenticated_access_denied(self):
        self.client.force_authenticate(user=None)
        url = reverse("microgrant-list-create")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
