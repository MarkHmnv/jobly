from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from candidate.models import Candidate
from core.models import User
from core.serializers import UserSerializer, UserDetailSerializer


class CandidateSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer()
    tokens = serializers.SerializerMethodField()

    class Meta:
        model = Candidate
        fields = ['user', 'tokens']
        read_only_fields = ['tokens']

    def get_tokens(self, obj):
        refresh = RefreshToken.for_user(obj.user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = user_data.pop('password')
        with transaction.atomic():
            user = User.objects.create_user(
                password=password,
                is_candidate=True,
                **user_data
            )
            candidate = Candidate.objects.create(user=user, **validated_data)

        tokens = self.get_tokens(candidate)
        candidate.tokens = tokens

        return candidate


class CandidateDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Candidate
        fields = ['user', 'position', 'experience', 'country', 'city', 'about']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        user = instance.user

        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
