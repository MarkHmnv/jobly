# Generated by Django 4.2.7 on 2023-11-28 16:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recruiter', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recruiter',
            name='about',
            field=models.TextField(max_length=5000, null=True),
        ),
        migrations.AlterField(
            model_name='recruiter',
            name='city',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='recruiter',
            name='country',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
