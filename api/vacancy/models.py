from django.db import models


class Vacancy(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=5000)
    category = models.ForeignKey('core.Category', on_delete=models.SET_NULL, null=True)
    skills = models.ManyToManyField('core.Skill')
    experience = models.IntegerField()
    salary = models.IntegerField(null=True)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)

    candidates = models.ManyToManyField('candidate.Candidate', blank=True)
    recruiter = models.ForeignKey('recruiter.Recruiter', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.title