from django.conf import settings
from django.db import models


class Candidate(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    position = models.CharField(max_length=100, null=True)
    category = models.ForeignKey('core.Category', on_delete=models.SET_NULL, null=True)
    skills = models.ManyToManyField('core.Skill', blank=True)
    experience = models.IntegerField(null=True)
    salary = models.IntegerField(null=True)
    country = models.CharField(max_length=100, null=True)
    city = models.CharField(max_length=100, null=True)
    about = models.TextField(max_length=5000, null=True)
    phone = models.CharField(max_length=100, null=True)
    linkedin = models.CharField(max_length=100, null=True)
    github = models.CharField(max_length=100, null=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.user.email

    def delete(self, using=None, keep_parents=False):
        self.user.delete()
        super().delete()
