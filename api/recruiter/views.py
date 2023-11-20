from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from recruiter.models import Recruiter
from recruiter.serializers import RecruiterSerializer, RecruiterDetailSerializer
from core.permissions import IsRecruiter


class CreateRecruiterView(generics.CreateAPIView):
    serializer_class = RecruiterSerializer


class ManageRecruiterView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RecruiterDetailSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsRecruiter]

    def get_object(self):
        """Retrieve and return authenticated user"""
        return self.request.user.recruiter


class RetrieveRecruiterView(generics.RetrieveAPIView):
    queryset = Recruiter.objects.all()
    serializer_class = RecruiterDetailSerializer
    lookup_field = 'id'
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]