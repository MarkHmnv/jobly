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
    recruiter = models.ForeignKey('recruiter.Recruiter', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.title


class VacancyApplication(models.Model):
    candidate = models.ForeignKey('candidate.Candidate', on_delete=models.CASCADE, null=True)
    vacancy = models.ForeignKey('vacancy.Vacancy', on_delete=models.CASCADE, null=True)
    cover_letter = models.TextField(max_length=5000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['candidate', 'vacancy'], name='unique_vacancy_application')
        ]

    def __str__(self):
        return self.cover_letter