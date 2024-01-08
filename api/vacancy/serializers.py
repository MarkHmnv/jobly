from django.db import IntegrityError
from rest_framework.generics import get_object_or_404

from candidate.serializers import CandidateGeneralSerializer
from core.models import Skill, Category
from core.serializers import CategorySerializer, SkillSerializer
from core.utils import get_or_404, update_category, update_skills
from vacancy.models import Vacancy, VacancyApplication
from rest_framework import serializers

from vacancy.similarity import calculate_candidate_quality


class VacancyDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    skills = SkillSerializer(many=True)
    owner = serializers.SerializerMethodField()

    class Meta:
        model = Vacancy
        fields = ('id', 'title', 'description', 'category', 'skills',
                  'experience', 'salary', 'country', 'city', 'owner')

        read_only_fields = ('id', 'owner')

    def get_owner(self, obj):
        request = self.context['request'].user
        return hasattr(request, 'recruiter') and obj.recruiter == request.recruiter

    def create(self, validated_data):
        category_data = validated_data.pop('category', None)
        skills_data = validated_data.pop('skills', [])
        recruiter = self.context['request'].user.recruiter

        category = get_or_404(Category, category_data, 'Category not found')
        vacancy = Vacancy.objects.create(
            category=category,
            recruiter=recruiter,
            **validated_data
        )

        for skill_data in skills_data:
            skill = get_or_404(Skill, skill_data, 'Skill not found')
            vacancy.skills.add(skill)

        vacancy.save()
        return vacancy

    def update(self, instance, validated_data):
        category_data = validated_data.pop('category', None)
        skills_data = validated_data.pop('skills', [])

        update_category(instance, category_data)
        update_skills(instance, skills_data)

        for k, v in validated_data.items():
            setattr(instance, k, v)

        instance.save()
        return instance


class VacancyGeneralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacancy
        fields = ('id', 'title', 'description',
                  'experience', 'salary', 'country', 'city')
        read_only_fields = fields


class VacancyApplicationSerializer(serializers.ModelSerializer):
    candidate = CandidateGeneralSerializer(read_only=True)
    quality = serializers.SerializerMethodField()

    class Meta:
        model = VacancyApplication
        fields = ('id', 'cover_letter', 'created_at', 'candidate', 'quality')
        read_only_fields = ('id', 'created_at', 'candidate', 'quality')

    def get_quality(self, obj):
        return calculate_candidate_quality(obj.vacancy, obj.candidate)

    def create(self, validated_data):
        candidate = self.context['request'].user.candidate
        vacancy_id = self.context['view'].kwargs.get('vacancy_id')
        vacancy = get_object_or_404(Vacancy, id=vacancy_id)

        if candidate.category is None or candidate.salary is None or candidate.experience is None:
            raise serializers.ValidationError({'error': 'You must complete your profile to apply for a vacancy.'})

        try:
            return VacancyApplication.objects.create(
                candidate=candidate,
                vacancy=vacancy,
                **validated_data
            )
        except IntegrityError:
            raise serializers.ValidationError({'error': 'You have already applied to this vacancy.'})
