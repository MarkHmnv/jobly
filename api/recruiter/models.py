from django.conf import settings
from django.db import models


class Recruiter(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    country = models.CharField(max_length=100, null=True)
    city = models.CharField(max_length=100, null=True)
    about = models.TextField(max_length=5000, null=True)

    def __str__(self):
        return self.user.email

    def delete(self, using=None, keep_parents=False):
        self.user.delete()
        super().delete()