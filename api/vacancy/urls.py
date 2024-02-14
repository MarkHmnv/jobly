from django.urls import path
from . import views

app_name = 'vacancies'

urlpatterns = [
    path('', views.VacancyView.as_view({'get': 'list', 'post': 'create'}), name='vacancy-list'),
    path('<int:id>/', views.VacancyView.as_view(
        {'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}
    ), name='vacancy-detail'),
    path('<int:vacancy_id>/apply/', views.VacancyApplicationCreateView.as_view(), name='apply-vacancy'),
    path('<int:vacancy_id>/applications/', views.VacancyApplicationList.as_view(), name='application-list'),
    path('<int:vacancy_id>/applications/<int:id>/', views.VacancyApplicationManageView.as_view(), name='application-detail'),
    path('recommendations/', views.RecommendationList.as_view(), name='recommendation-list'),
]
