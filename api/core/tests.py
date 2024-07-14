import os
import tempfile

from PIL import Image
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from candidate.models import Candidate
from core.models import Category, User
from recruiter.models import Recruiter


def create_category(name='Test', **params):
    return Category.objects.create(name=name, **params)


def create_candidate(
    email='test@example.com',
    password='password',
    salary=100,
    experience=1,
    skill=None,
    category=None,
):
    user = User.objects.create_user(email=email, password=password, is_candidate=True)
    candidate = Candidate.objects.create(
        user=user, salary=salary, experience=experience, category=category
    )
    if skill:
        candidate.skills.set([skill])
    return candidate


def create_recruiter(email='test@example.com', password='password', **params):
    user = User.objects.create_user(email=email, password=password, is_recruiter=True)
    return Recruiter.objects.create(user=user, **params)


def generate_api_client(user, role='candidate'):
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    refresh['role'] = role
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(refresh.access_token))
    return client


UPLOAD_IMAGE_URL = reverse('shared:upload-image')


class ImageUploadTestCase(TestCase):
    """Tests for image upload, by default uses candidate user"""

    role = 'candidate'

    @classmethod
    def setUpTestData(cls):
        cls.user = create_candidate() if cls.role == 'candidate' else create_recruiter()

    def setUp(self):
        self.client = generate_api_client(self.user.user, role=self.role)

    def tearDown(self):
        self.user.user.image.delete()

    def test_upload_image(self):
        with tempfile.NamedTemporaryFile(suffix='.jpg') as image_file:
            img = Image.new('RGB', (10, 10))
            img.save(image_file, format='JPEG')
            image_file.seek(0)
            payload = {'image': image_file}
            res = self.client.post(UPLOAD_IMAGE_URL, payload, format='multipart')

        self.user.refresh_from_db()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('image', res.data)
        self.assertTrue(os.path.exists(self.user.user.image.path))

    def test_upload_image_bad_request(self):
        payload = {'image': 'notanimage'}
        res = self.client.post(UPLOAD_IMAGE_URL, payload, format='multipart')

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_image(self):
        self.test_upload_image()
        path = self.user.user.image.path
        res = self.client.delete(UPLOAD_IMAGE_URL)

        self.user.refresh_from_db()
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(os.path.exists(path))


class RecruiterImageUploadTests(ImageUploadTestCase):
    """Same tests for image upload, but for recruiter user"""

    role = 'recruiter'
