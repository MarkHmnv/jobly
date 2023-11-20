from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from recruiter.models import Recruiter

User = get_user_model()

CREATE_RECRUITER_URL = reverse('recruiters:create')
TOKEN_URL = reverse('token_obtain_pair')
ME_URL = reverse('recruiters:me')


def get_recruiter_by_id(id):
    return reverse('recruiters:retrieve', args=[id])


def create_recruiter(email='test@example.com', password='password', **params):
    user = User.objects.create_user(
        email=email,
        password=password,
        is_recruiter=True
    )
    return Recruiter.objects.create(
        user=user,
        **params
    )


class PublicRecruiterTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.payload = {
            'user': {
                'email': 'test@example.com',
                'password': 'password',
                'first_name': 'Test',
                'last_name': 'Recruiter',
            }
        }

    def test_create_recruiter_success(self):
        res = self.client.post(CREATE_RECRUITER_URL, self.payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email=self.payload['user']['email'])
        self.assertTrue(user.check_password(self.payload['user']['password']))
        self.assertEqual(user.is_recruiter, True)

        recruiter = Recruiter.objects.get(user=user)
        self.assertEqual(recruiter.user.first_name, self.payload['user']['first_name'])
        self.assertEqual(recruiter.user.last_name, self.payload['user']['last_name'])

    def test_create_recruiter_invalid_password(self):
        self.payload['user']['password'] = '123'
        res = self.client.post(CREATE_RECRUITER_URL, self.payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_recruiter_with_email_exists_error(self):
        create_recruiter()
        res = self.client.post(CREATE_RECRUITER_URL, self.payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_tokens_success(self):
        create_recruiter()
        payload = {
            'email': self.payload['user']['email'],
            'password': self.payload['user']['password'],
        }
        res = self.client.post(TOKEN_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)
        self.assertIn('refresh', res.data)

    def test_create_tokens_invalid_credentials(self):
        create_recruiter()
        payload = {
            'email': self.payload['user']['email'],
            'password': 'wrong-password',
        }
        res = self.client.post(TOKEN_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        payload = {
            'email': 'wrong-email',
            'password': self.payload['user']['password'],
        }
        res = self.client.post(TOKEN_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_recruiter_unauthorized(self):
        res = self.client.get(ME_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_recruiter_by_id_unauthorized(self):
        res = self.client.get(get_recruiter_by_id(1))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateRecruiterTests(TestCase):
    def setUp(self):
        self.recruiter = create_recruiter()
        self.user = self.recruiter.user
        self.client = APIClient()

        refresh = RefreshToken.for_user(self.user)
        refresh['role'] = 'recruiter'
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(refresh.access_token))
        self.response = {
            'user': {
                'first_name': self.user.first_name,
                'last_name': self.user.last_name,
            },
            'country': self.recruiter.country,
            'city': self.recruiter.city,
            'about': self.recruiter.about,
        }

    def test_retrieve_recruiter_success(self):
        res = self.client.get(ME_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, self.response)

    def test_retrieve_recruiter_by_id_success(self):
        res = self.client.get(get_recruiter_by_id(self.recruiter.id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, self.response)

    def test_update_recruiter_success(self):
        payload = {
            'country': 'new country',
            'city': 'new city',
            'about': 'new about',
        }
        res = self.client.patch(ME_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.recruiter.refresh_from_db()
        for key, value in payload.items():
            self.assertEqual(getattr(self.recruiter, key), value)

    def test_delete_recruiter_success(self):
        res = self.client.delete(ME_URL)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
