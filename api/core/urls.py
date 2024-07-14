from django.urls import path

from .views import CategoryListView, SkillListView, UserImageView

app_name = 'shared'

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('skills/', SkillListView.as_view(), name='skill-list'),
    path('upload-image/', UserImageView.as_view(), name='upload-image'),
]
