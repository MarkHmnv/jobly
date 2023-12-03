from django.urls import path

from candidate import views


app_name = 'candidates'

urlpatterns = [
    path('', views.CreateCandidateView.as_view(), name='create'),
    path('me/', views.ManageCandidateView.as_view(), name='me'),
    path('<int:id>/', views.RetrieveCandidateView.as_view(), name='retrieve'),
    path('list/', views.ListCandidateView.as_view(), name='candidate-list'),
]