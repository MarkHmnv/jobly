from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView

from core.models import Category, Skill
from core.serializers import TokenWithRoleSerializer, CategorySerializer, SkillSerializer


class TokenWithRoleView(TokenObtainPairView):
    serializer_class = TokenWithRoleSerializer


class BasicListView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class CategoryListView(BasicListView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SkillListView(BasicListView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer