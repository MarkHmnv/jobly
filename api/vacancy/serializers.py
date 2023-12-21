from rest_framework.generics import get_object_or_404

from candidate.serializers import CandidateGeneralSerializer
from core.models import Skill, Category
from core.serializers import CategorySerializer, SkillSerializer
from core.utils import get_or_404, update_category, update_skills
from vacancy.models import Vacancy, VacancyApplication
from rest_framework import serializers


class VacancyDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    skills = SkillSerializer(many=True)

    class Meta:
        model = Vacancy
        fields = ('id', 'title', 'description', 'category', 'skills',
                  'experience', 'salary', 'country', 'city')

        read_only_fields = ('id',)

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
    candidate = CandidateGeneralSerializer()

    class Meta:
        model = VacancyApplication
        fields = ('id', 'candidate', 'cover_letter', 'created_at')
        read_only_fields = ('id', 'candidate', 'created_at')

    def create(self, validated_data):
        candidate = self.context['request'].user.candidate
        vacancy_id = self.context['view'].kwargs.get('vacancy_id')
        vacancy = get_object_or_404(Vacancy, id=vacancy_id)

        return VacancyApplication.objects.create(
            candidate=candidate,
            vacancy=vacancy,
            **validated_data
        )


class VacancyWithApplicationsSerializer(VacancyDetailSerializer):
    applications = VacancyApplicationSerializer(many=True)

    class Meta(VacancyDetailSerializer.Meta):
        fields = VacancyDetailSerializer.Meta.fields + ('applications',)
        read_only_fields = VacancyDetailSerializer.Meta.read_only_fields + ('applications',)