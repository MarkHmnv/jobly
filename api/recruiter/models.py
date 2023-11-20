from django.conf import settings
from django.db import models


class Recruiter(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    about = models.TextField(max_length=5000)

    def __str__(self):
        return self.user.email