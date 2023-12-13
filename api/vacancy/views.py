from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.permissions import IsRecruiter, IsRecruiterAndOwner, IsCandidate, IsCandidateAndOwner
from vacancy.models import Vacancy, VacancyApplication
from vacancy.serializers import (
    VacancyDetailSerializer,
    VacancyGeneralSerializer,
    VacancyApplicationSerializer,
    VacancyWithApplicationsSerializer
)


class VacancyView(viewsets.ModelViewSet):
    queryset = Vacancy.objects.all()
    lookup_field = 'id'
    authentication_classes = [JWTAuthentication]

    def get_serializer_class(self):
        if self.action == 'list':
            return VacancyGeneralSerializer
        elif (self.action == 'retrieve'):
            obj = self.get_object()
            if hasattr(self.request.user, 'recruiter') and obj.recruiter == self.request.user.recruiter:
                return VacancyWithApplicationsSerializer
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
