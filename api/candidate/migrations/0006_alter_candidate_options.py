# Generated by Django 5.0.4 on 2024-04-18 20:17

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('candidate', '0005_candidate_category_candidate_github_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='candidate',
            options={'ordering': ['-id']},
        ),
    ]
