from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'vacancies'

router = DefaultRouter()
router.register('', views.VacancyViewSet)

urlpatterns = [
    path('', include(router.urls)),
]