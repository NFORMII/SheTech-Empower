from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework.authtoken.models import Token
from accounts.models import User


class AuthTests(APITestCase):  # changed from TestCase to APITestCase
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.me_url = reverse('me')

        self.valid_user_data = {
            'full_name': 'Jane',
            'email': 'jane@example.com',
            'password': 'StrongPass123!',
            'role': 'mentor'
        }

        self.user = User.objects.create_user(
            full_name="Existing",
            email="user@example.com",
            password="Password123!",
            role="youth"
        )

    def test_register_success(self):
        res = self.client.post(self.register_url, self.valid_user_data)
        self.assertEqual(res.status_code, 201)
        self.assertIn('token', res.data)

    def test_register_missing_fields(self):
        res = self.client.post(self.register_url, {})
        self.assertEqual(res.status_code, 400)
        self.assertIn('email', res.data)

    def test_register_duplicate_email(self):
        res = self.client.post(self.register_url, {
            **self.valid_user_data,
            'email': 'user@example.com'
        })
        self.assertEqual(res.status_code, 400)

    def test_login_success(self):
        res = self.client.post(self.login_url, {
            'email': 'user@example.com',
            'password': 'Password123!'
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn('token', res.data)

    def test_login_invalid_password(self):
        res = self.client.post(self.login_url, {
            'email': 'user@example.com',
            'password': 'wrongpass'
        })
        self.assertEqual(res.status_code, 401)

    def test_login_missing_fields(self):
        res = self.client.post(self.login_url, {'email': 'user@example.com'})
        self.assertEqual(res.status_code, 400)

    def test_logout_success(self):
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        res = self.client.post(self.logout_url)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['message'], 'Logged out successfully')

    def test_logout_without_token(self):
        res = self.client.post(self.logout_url)
        self.assertEqual(res.status_code, 401)

    def test_me_authenticated(self):
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        res = self.client.get(self.me_url)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['email'], self.user.email)

    def test_me_unauthenticated(self):
        res = self.client.get(self.me_url)
        self.assertEqual(res.status_code, 401)
