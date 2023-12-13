from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'vacancies'

router = DefaultRouter()
router.register('', views.VacancyView)

urlpatterns = [
    path('', include(router.urls)),
    path('<int:vacancy_id>/apply', views.VacancyApplicationCreateView.as_view(), name='apply-vacancy'),
    path(
        '<int:vacancy_id>/applications/<int:id>/',
        views.VacancyApplicationManageView.as_view(),
        name='application-detail'
    ),
]
