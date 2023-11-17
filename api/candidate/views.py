from rest_framework import generics
from rest_framework_simplejwt.authentication import JWTAuthentication

from candidate.serializers import CandidateDetailSerializer, CandidateSerializer
from core.permissions import IsCandidate


class CreateCandidateView(generics.CreateAPIView):
    serializer_class = CandidateSerializer


class ManageCandidateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CandidateDetailSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsCandidate]

    def get_object(self):
        """Retrieve and return authenticated user"""
        return self.request.user.candidate
