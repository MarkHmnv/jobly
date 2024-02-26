from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from core.models import User, Skill, Category


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'image')
        read_only_fields = ('image',)


class UserDetailSerializer(UserSerializer):

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ('password',)
        extra_kwargs = {
            "password": {"write_only": True, "min_length": 6}
        }


class UserImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'image')
        read_only_fields = ('id',)
        extra_kwargs = {
            'image': {'required': True}
        }


class TokenWithRoleSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['role'] = 'candidate' if user.is_candidate else 'recruiter'
        token['name'] = f'{user.first_name} {user.last_name}'

        return token


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['name']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']