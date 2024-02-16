from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from rest_framework import viewsets, generics, serializers, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.pagination import Pagination
from core.permissions import IsRecruiter, IsRecruiterAndOwner, IsCandidate, IsCandidateAndOwner
from core.utils import check_profile_complete
from vacancy.models import Vacancy, VacancyApplication
from vacancy.serializers import (
    VacancyDetailSerializer,
    VacancyGeneralSerializer,
    VacancyApplicationSerializer,
)
from vacancy.similarity import calculate_quality


QUALITY_THRESHOLD = 0.5
CACHE_KEY_PREFIX = 'recommendation_list'


class VacancyView(viewsets.ModelViewSet):
    queryset = Vacancy.objects.all()
    lookup_field = 'id'
    authentication_classes = [JWTAuthentication]
    pagination_class = Pagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = {
        'skills__name': ['exact', 'in'],
        'category__name': ['exact', 'in'],
        'salary': ['exact', 'gte', 'lte'],
    }

    search_fields = ['title', 'description', 'country', 'city']
    ordering_fields = ['created_at', 'salary']

    def get_serializer_class(self):
        if self.action == 'list':
            return VacancyGeneralSerializer
        return VacancyDetailSerializer

    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [IsRecruiter]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsRecruiterAndOwner]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class VacancyApplicationCreateView(generics.CreateAPIView):
    serializer_class = VacancyApplicationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsCandidate]


class VacancyApplicationManageView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VacancyApplication.objects.all()
    lookup_field = 'id'
    serializer_class = VacancyApplicationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsCandidateAndOwner]


class VacancyApplicationList(generics.ListAPIView):
    queryset = VacancyApplication.objects.all()
    serializer_class = VacancyApplicationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination

    def get_queryset(self):
        vacancy_id = self.kwargs.get('vacancy_id', None)
        if not vacancy_id:
            return VacancyApplication.objects.none()

        vacancy = get_object_or_404(Vacancy, id=vacancy_id)

        if not hasattr(self.request.user, 'recruiter') or vacancy.recruiter != self.request.user.recruiter:
            raise PermissionDenied('You do not have permission to view these applications.')

        sort_by = self.request.query_params.get('sort_by', 'quality')
        reverse = self.request.query_params.get('reverse', 'true').lower() == 'true'

        if sort_by == 'quality':
            sorted_applications = sorted(
                vacancy.applications.all(),
                key=lambda application: calculate_quality(vacancy, application.candidate),
                reverse=reverse
            )
        elif sort_by == 'created_at':
            sorted_applications = vacancy.applications.order_by('-created_at' if reverse else 'created_at')
        else:
            raise serializers.ValidationError({'error': 'Invalid sort_by parameter.'})

        return sorted_applications


class RecommendationList(generics.ListAPIView):
    serializer_class = VacancyGeneralSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination

    # recommendations will be updated every 15 minutes
    @method_decorator(cache_page(60 * 15, key_prefix=CACHE_KEY_PREFIX))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        candidate = self.request.user.candidate

        check_profile_complete(candidate, 'You must complete your profile to get recommended vacancies.')

        cached_result = cache.get(self.get_cache_key())
        if cached_result is not None:
            return cached_result

        # Get applications made by the candidate
        applied_vacancies = VacancyApplication.objects.filter(candidate=candidate).values_list('vacancy', flat=True)

        # Filter vacancies that the candidate has not applied for
        vacancies = Vacancy.objects.exclude(id__in=applied_vacancies)

        vacancies_quality = {
            vacancy: calculate_quality(vacancy, candidate)
            for vacancy in vacancies
        }

        sorted_vacancies = [
            vacancy
            for vacancy, quality in vacancies_quality.items()
            if quality >= QUALITY_THRESHOLD
        ]

        sorted_vacancies.sort(key=lambda vacancy: vacancies_quality[vacancy], reverse=True)

        cache.set(self.get_cache_key(), sorted_vacancies)

        return sorted_vacancies

    def get_cache_key(self):
        user_id = self.request.user.id
        return f'{CACHE_KEY_PREFIX}_{user_id}'
