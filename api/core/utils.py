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
        category = get_or_404(Category, category_data, 'Category not found')
        instance.category = category


def update_skills(instance, skills_data):
    instance.skills.clear()
    for skill_data in skills_data:
        skill = get_or_404(Skill, skill_data, 'Skill not found')
        instance.skills.add(skill)

