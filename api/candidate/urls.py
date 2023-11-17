from django.urls import path

from candidate import views


app_name = "candidates"

urlpatterns = [
    path("", views.CreateCandidateView.as_view(), name="create"),
    path("me/", views.ManageCandidateView.as_view(), name="me")
]