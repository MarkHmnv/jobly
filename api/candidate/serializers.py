from django.db import transaction
from django.http import Http404
from rest_framework.generics import get_object_or_404
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from candidate.models import Candidate
from core.models import User, Category, Skill
from core.serializers import (
    UserSerializer,
    UserDetailSerializer,
    SkillSerializer,
    CategorySerializer
)

import re

from core.utils import update_category, update_skills

phone_pattern = r'^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$'
linkedin_pattern = r'https?://([a-z]+\.)?linkedin\.com/(in|pub)/[a-zA-Z0-9-]+(/[0-9A-Z]+)?'
github_pattern = r'https?://github\.com/[a-zA-Z0-9-]+/?'


class CandidateCreateSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer()
    tokens = serializers.SerializerMethodField()

    class Meta:
        model = Candidate
        fields = ['user', 'tokens']
        read_only_fields = ['tokens']

    def get_tokens(self, obj):
        refresh = RefreshToken.for_user(obj.user)
        refresh['role'] = 'candidate'
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
    skills = SkillSerializer(many=True)
    category = CategorySerializer()

    class Meta:
        model = Candidate
        fields = ('user', 'position', 'category', 'skills',
                  'experience', 'salary', 'country', 'city',
                  'about', 'phone', 'linkedin', 'github')

    def validate_phone(self, value):
        if value is not None and not re.match(phone_pattern, value):
            raise serializers.ValidationError('phone number is invalid.')

        return value

    def validate_linkedin(self, value):
        if value is not None and not re.match(linkedin_pattern, value):
            raise serializers.ValidationError('Linkedin profile URL is invalid.')
        return value

    def validate_github(self, value):
        if value is not None and not re.match(github_pattern, value):
            raise serializers.ValidationError('Github profile URL is invalid.')
        return value

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        category_data = validated_data.pop('category', None)
        skills_data = validated_data.pop('skills', [])
        user = instance.user

        if user_data is not None:
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()

        update_category(instance, category_data)
        update_skills(instance, skills_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


class CandidateGeneralSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    skills = SkillSerializer(many=True)

    class Meta:
        model = Candidate
        fields = ('id', 'user', 'position', 'category',
                  'salary', 'country', 'city', 'skills')
        read_only_fields = fields