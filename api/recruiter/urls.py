from django.urls import path

from recruiter import views


app_name = 'recruiters'

urlpatterns = [
    path('', views.CreateRecruiterView.as_view(), name='create'),
    path('me/', views.ManageRecruiterView.as_view(), name='me'),
    path('<int:id>/', views.RetrieveRecruiterView.as_view(), name='retrieve'),
]