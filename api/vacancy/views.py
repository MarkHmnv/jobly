from rest_framework import viewsets, generics, serializers, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.permissions import IsRecruiter, IsRecruiterAndOwner, IsCandidate, IsCandidateAndOwner
from vacancy.models import Vacancy, VacancyApplication
from vacancy.serializers import (
    VacancyDetailSerializer,
    VacancyGeneralSerializer,
    VacancyApplicationSerializer,
)
from vacancy.similarity import calculate_candidate_quality


class VacancyView(viewsets.ModelViewSet):
    queryset = Vacancy.objects.all()
    lookup_field = 'id'
    authentication_classes = [JWTAuthentication]
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
                key=lambda application: calculate_candidate_quality(vacancy, application.candidate),
                reverse=reverse
            )
        elif sort_by == 'created_at':
            sorted_applications = vacancy.applications.order_by('-created_at' if reverse else 'created_at')
        else:
            raise serializers.ValidationError({'error': 'Invalid sort_by parameter.'})

        return sorted_applications
