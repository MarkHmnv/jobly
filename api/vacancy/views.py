from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.permissions import IsRecruiter, IsRecruiterAndOwner
from vacancy.models import Vacancy
from vacancy.serializers import VacancyDetailSerializer, VacancyGeneralSerializer


class VacancyViewSet(viewsets.ModelViewSet):
    queryset = Vacancy.objects.all()
    lookup_field = 'id'
    authentication_classes = [JWTAuthentication]

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