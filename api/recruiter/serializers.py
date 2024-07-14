from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from core.models import User
from core.serializers import UserSerializer, UserDetailSerializer
from recruiter.models import Recruiter


class RecruiterSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer()
    tokens = serializers.SerializerMethodField()

    class Meta:
        model = Recruiter
        fields = ['user', 'tokens']

    def get_tokens(self, obj):
        refresh = RefreshToken.for_user(obj.user)
        refresh['role'] = 'recruiter'
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = user_data.pop('password')
        with transaction.atomic():
            user = User.objects.create_user(
                password=password, is_recruiter=True, **user_data
            )
            recruiter = Recruiter.objects.create(user=user, **validated_data)

        tokens = self.get_tokens(recruiter)
        recruiter.tokens = tokens

        return recruiter


class RecruiterDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Recruiter
        fields = ['user', 'country', 'city', 'about']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)

        if user_data is not None:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)
            instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
