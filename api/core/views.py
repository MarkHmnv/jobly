from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView

from core.models import Category, Skill
from core.serializers import TokenWithRoleSerializer, CategorySerializer, SkillSerializer, UserImageSerializer


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


class UserImageView(generics.CreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserImageSerializer

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)

        existing_image = user.image
        if existing_image:
            existing_image.delete()

        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        user = request.user
        user.image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)