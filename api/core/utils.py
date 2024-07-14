from django.http import Http404
from rest_framework.generics import get_object_or_404
from rest_framework import serializers

from core.models import Category, Skill


def get_or_404(model, data, message):
    try:
        return get_object_or_404(model, name=data['name'])
    except Http404:
        raise serializers.ValidationError({'detail': message})


def update_category(instance, category_data):
    if category_data is not None:
        category = get_or_404(
            Category, category_data, f'Category {category_data["name"]} not found'
        )
        instance.category = category


def update_skills(instance, skills_data):
    instance.skills.clear()
    for skill_data in skills_data:
        skill = get_or_404(Skill, skill_data, f'Skill {skill_data["name"]} not found')
        instance.skills.add(skill)


def check_profile_complete(candidate, message='You must complete your profile.'):
    if (
        candidate.category is None
        or candidate.salary is None
        or candidate.experience is None
        or candidate.skills.count() == 0
    ):
        raise serializers.ValidationError({'error': message})
