from core.models import Skill, Category
from core.serializers import CategorySerializer, SkillSerializer
from core.utils import get_or_404, update_category, update_skills
from vacancy.models import Vacancy
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