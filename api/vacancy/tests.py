from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from candidate.tests import create_candidate
from core.models import Skill, Category
from core.tests import create_category
from core.utils import get_or_404
from recruiter.tests import create_recruiter
from vacancy.models import Vacancy, VacancyApplication

VACANCIES_URL = reverse('vacancies:vacancy-list')


def get_vacancy_by_id(id):
    return reverse('vacancies:vacancy-detail', args=[id])

def apply_for_vacancy_by_id(vacancy_id):
    return reverse('vacancies:apply-vacancy', args=[vacancy_id])

def get_vacancy_application_by_id(vacancy_id, application_id):
    return reverse('vacancies:application-detail', args=[vacancy_id, application_id])

def create_vacancy(recruiter, **params):
    if 'category' in params:
        params['category'] = Category.objects.get(name=params['category']['name'])

    skills = params.pop('skills', [])
    vacancy = Vacancy.objects.create(recruiter=recruiter, **params)
    for skill_data in skills:
        skill = get_or_404(Skill, skill_data, 'Skill not found')
        vacancy.skills.add(skill)

    return vacancy

def create_vacancy_application(vacancy, candidate):
    return VacancyApplication.objects.create(
        vacancy=vacancy, 
        candidate=candidate, 
        cover_letter='Test cover letter'
        )

def authorize_another_user(client, role='recruiter'):
    if role == 'recruiter':
        another_recruiter = create_recruiter(email='test2@test.com')
        refresh = RefreshToken.for_user(another_recruiter.user)
        refresh['role'] = 'recruiter'
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(refresh.access_token))
    elif role == 'candidate':
        another_candidate = create_candidate(email='test2@test.com')
        refresh = RefreshToken.for_user(another_candidate.user)
        refresh['role'] = 'candidate'
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(refresh.access_token))
    return client 



class VacancyRecruiterTest(TestCase):
    def setUp(self):
        create_category()
        self.recruiter = create_recruiter()
        self.client = APIClient()
        refresh = RefreshToken.for_user(self.recruiter.user)
        refresh['role'] = 'recruiter'
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(refresh.access_token))
        self.payload = {
            'id': 1,
            'title': 'Test',
            'description': 'Test',
            'category': {
                'name': 'Test',
            },
            'skills': [],
            'experience': 1,
            'salary': 100,
            'country': 'Test',
            'city': 'Test',
        }

    def test_create_vacancy_success(self):
        res = self.client.post(VACANCIES_URL, self.payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Vacancy.objects.count(), 1)
        for k, v in self.payload.items():
            self.assertEqual(res.data[k], v)

    def test_create_vacancy_fail(self):
        self.payload['category'] = None
        res = self.client.post(VACANCIES_URL, self.payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_vacancy_success(self):
        create_category(name='Test2')
        create_vacancy(self.recruiter, **self.payload)

        self.payload['title'] = 'Test2'
        self.payload['category'] = {
            'name': 'Test2',
        }
        res = self.client.patch(get_vacancy_by_id(1), self.payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(Vacancy.objects.count(), 1)
        for k, v in self.payload.items():
            self.assertEqual(res.data[k], v)

    def test_update_vacancy_fail(self):
        create_vacancy(self.recruiter, **self.payload)

        self.payload['category'] = {
            'name': 'Test2',
        }
        res = self.client.patch(get_vacancy_by_id(1), self.payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_vacancy_forbidden(self):
        create_vacancy(self.recruiter, **self.payload)
        self.client = authorize_another_user(self.client)

        res = self.client.patch(get_vacancy_by_id(1), self.payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_destroy_vacancy_success(self):
        create_vacancy(self.recruiter, **self.payload)
        res = self.client.delete(get_vacancy_by_id(1))
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Vacancy.objects.count(), 0)

    def test_destroy_vacancy_fail(self):
        res = self.client.delete(get_vacancy_by_id(1))
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_destroy_vacancy_forbidden(self):
        create_vacancy(self.recruiter, **self.payload)
        self.client = authorize_another_user(self.client)

        res = self.client.delete(get_vacancy_by_id(1))
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class VacancyCandidateTest(TestCase):
    def setUp(self):
        self.payload = {
            'id': 1,
            'title': 'Test',
            'description': 'Test',
            'category': {
                'name': 'Test',
            },
            'skills': [],
            'experience': 1,
            'salary': 100,
            'country': 'Test',
            'city': 'Test',
        }
        self.application_payload = {
            'cover_letter': 'Test cover letter',
        }
        create_category()
        recruiter = create_recruiter()
        self.vacancy = create_vacancy(recruiter=recruiter, **self.payload)
        self.candidate = create_candidate(email='test1@test.com')
        self.client = APIClient()
        refresh = RefreshToken.for_user(self.candidate.user)
        refresh['role'] = 'candidate'
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(refresh.access_token))

    def test_create_vacancy_forbidden(self):
        res = self.client.post(VACANCIES_URL, self.payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Vacancy.objects.count(), 1)

    def test_update_vacancy_forbidden(self):
        res = self.client.patch(get_vacancy_by_id(1), self.payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_destroy_vacancy_forbidden(self):
        res = self.client.delete(get_vacancy_by_id(1))
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_vacancy_success(self):
        res = self.client.get(get_vacancy_by_id(1))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        for k, v in self.payload.items():
            self.assertEqual(res.data[k], v)

    def test_list_vacancies_success(self):
        res = self.client.get(VACANCIES_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertNotIn('category', res.data[0])

    def test_apply_for_vacancy_success(self):
        res = self.client.post(apply_for_vacancy_by_id(1), self.application_payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['cover_letter'], self.application_payload['cover_letter'])
        self.assertEqual(VacancyApplication.objects.count(), 1)
    
    def test_retrieve_vacancy_application_success(self):
        application = create_vacancy_application(self.vacancy, self.candidate)
        res = self.client.get(get_vacancy_application_by_id(self.vacancy.id, application.id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        for k, v in self.application_payload.items():
            self.assertEqual(res.data[k], v)

    def test_retrieve_vacancy_application_fail(self):
        res = self.client.get(get_vacancy_application_by_id(2, 2))
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def update_vacancy_application_success(self):
        application = create_vacancy_application(self.vacancy, self.candidate)
        self.application_payload['cover_letter'] = 'Updated cover letter'
        res = self.client.patch(
            get_vacancy_application_by_id(self.vacancy.id, application.id), 
            self.application_payload
            )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        for k, v in self.application_payload.items():
            self.assertEqual(res.data[k], v)

    def update_vacancy_application_forbidden(self):
        application = create_vacancy_application(self.vacancy, self.candidate)

        self.client = authorize_another_user(self.client, role='candidate')

        res = self.client.patch(
            get_vacancy_application_by_id(self.vacancy.id, application.id), 
            self.application_payload
            )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_destroy_vacancy_application_success(self):
        application = create_vacancy_application(self.vacancy, self.candidate)
        res = self.client.delete(get_vacancy_application_by_id(self.vacancy.id, application.id))
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(VacancyApplication.objects.count(), 0)

    def destroy_vacancy_application_forbidden(self):
        application = create_vacancy_application(self.vacancy, self.candidate)

        self.client = authorize_another_user(self.client, role='candidate')

        res = self.client.delete(get_vacancy_application_by_id(self.vacancy.id, application.id))
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(VacancyApplication.objects.count(), 1)
