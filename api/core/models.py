import os
import uuid

from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


def image_upload_to(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('uploads', 'users', filename)


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, is_candidate=False,
                    is_recruiter=False, **extra_fields):
        if not email:
            raise ValueError("Email should not be blank")
        user = self.model(
            email=self.normalize_email(email),
            is_candidate=is_candidate,
            is_recruiter=is_recruiter,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None):
        user = self.create_user(email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(max_length=100, unique=True)
    is_candidate = models.BooleanField(default=False)
    is_recruiter = models.BooleanField(default=False)
    image = models.ImageField(upload_to=image_upload_to, null=True)

    USERNAME_FIELD = 'email'

    objects = UserManager()

    def __str__(self):
        return self.email


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Skill(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name