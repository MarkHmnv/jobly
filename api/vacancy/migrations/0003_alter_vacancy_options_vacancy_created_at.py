# Generated by Django 4.2.7 on 2024-01-21 20:22

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('vacancy', '0002_alter_vacancy_recruiter_vacancyapplication_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='vacancy',
            options={'ordering': ['-created_at']},
        ),
        migrations.AddField(
            model_name='vacancy',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
