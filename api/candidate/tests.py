from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from candidate.models import Candidate

User = get_user_model()

CREATE_CANDIDATE_URL = reverse('candidates:create')
TOKEN_URL = reverse('token_obtain_pair')
ME_URL = reverse('candidates:me')


def get_candidate_by_id(id):
    return reverse('candidates:retrieve', args=[id])


def create_candidate(email='test@example.com', password='password', **params):
    user = User.objects.create_user(
        email=email,
        password=password,
        is_candidate=True
    )
    return Candidate.objects.create(
        user=user,
        **params
    )


class PublicCandidateTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.payload = {
            'user': {
                'email': 'test@example.com',
                'password': 'password',
                'first_name': 'Test',
                'last_name': 'User',
            }
        }

    def test_create_candidate_success(self):
        res = self.client.post(CREATE_CANDIDATE_URL, self.payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email=self.payload['user']['email'])
        self.assertTrue(user.check_password(self.payload['user']['password']))
        self.assertEqual(user.is_candidate, True)

        candidate = Candidate.objects.get(user=user)
        self.assertEqual(candidate.user.first_name, self.payload['user']['first_name'])
        self.assertEqual(candidate.user.last_name, self.payload['user']['last_name'])

    def test_create_candidate_invalid_password(self):
        self.payload['user']['password'] = '123'
        res = self.client.post(CREATE_CANDIDATE_URL, self.payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_candidate_with_email_exists_error(self):
        create_candidate()
        res = self.client.post(CREATE_CANDIDATE_URL, self.payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_tokens_success(self):
        create_candidate()
        payload = {
            'email': self.payload['user']['email'],
            'password': self.payload['user']['password'],
        }
        res = self.client.post(TOKEN_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)
        self.assertIn('refresh', res.data)

    def test_create_tokens_invalid_credentials(self):
        create_candidate()
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

    def test_retrieve_candidate_unauthorized(self):
        res = self.client.get(ME_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_candidate_by_id_unauthorized(self):
        res = self.client.get(get_candidate_by_id(1))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateCandidateTests(TestCase):
    def setUp(self):
        self.candidate = create_candidate()
        self.user = self.candidate.user
        self.client = APIClient()

        refresh = RefreshToken.for_user(self.user)
        refresh['role'] = 'candidate'
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(refresh.access_token))
        self.response = {
            'user': {
                'first_name': self.user.first_name,
                'last_name': self.user.last_name,
                'email': self.user.email,
            },
            'position': self.candidate.position,
            'category': None,
            'skills': [],
            'experience': self.candidate.experience,
            'salary': self.candidate.salary,
            'country': self.candidate.country,
            'city': self.candidate.city,
            'about': self.candidate.about,
            'phone': self.candidate.phone,
            'linkedin': self.candidate.linkedin,
            'github': self.candidate.github,
        }

    def test_retrieve_candidate_success(self):
        res = self.client.get(ME_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, self.response)

    def test_retrieve_candidate_by_id_success(self):
        res = self.client.get(get_candidate_by_id(self.candidate.id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, self.response)

    def test_update_candidate_success(self):
        payload = {
            'position': 'new position',
            'experience': 10,
            'country': 'new country',
            'city': 'new city',
            'about': 'new about',
            'phone': '+380123456789',
            'linkedin': 'https://www.linkedin.com/in/example/',
            'github': 'https://github.com/example',
        }
        res = self.client.patch(ME_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.candidate.refresh_from_db()
        for key, value in payload.items():
            self.assertEqual(getattr(self.candidate, key), value)

    def test_update_candidate_invalid_field(self):
        payload = {
            'position': 'new position',
            'experience': 10,
            'country': 'new country',
            'city': 'new city',
            'about': 'new about',
            'phone': '+380123456789',
            'linkedin': 'invalid url',
            'github': 'https://github.com/example',
        }
        res = self.client.patch(ME_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('linkedin', res.data)

        payload['linkedin'] = 'https://www.linkedin.com/in/example/'
        payload['github'] = 'invalid url'
        res = self.client.patch(ME_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('github', res.data)

        payload['github'] = 'https://github.com/example'
        payload['phone'] = 'invalid phone'
        res = self.client.patch(ME_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('phone', res.data)

    def test_delete_candidate_success(self):
        res = self.client.delete(ME_URL)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
