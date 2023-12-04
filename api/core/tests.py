from core.models import Category


def create_category(name='Test', **params):
    return Category.objects.create(name=name, **params)