from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser  # Importa tu modelo de usuario

admin.site.register(CustomUser, UserAdmin)


# Register your models here.
