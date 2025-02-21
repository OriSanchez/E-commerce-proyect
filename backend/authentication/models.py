from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUser(AbstractUser):
    first_name = models.CharField(max_length=200, blank=True, null=True)
    last_name = models.CharField(max_length=200)
    address = models.TextField()
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(unique=True)

    # Evitar conflictos con los accesores reversos
    groups = models.ManyToManyField(
        Group,
        related_name="customuser_set",  # Cambiar el nombre del acceso inverso
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_set",  # Cambiar el nombre del acceso inverso
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    def __str__(self):
        return self.email


class CreditCard(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='credit_card')
    card_number = models.CharField(max_length=16)
    expiration_date = models.DateField()
    cvv = models.CharField(max_length=3)

    def __str__(self):
        return f"Card for {self.user.email}"
