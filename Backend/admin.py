from django.contrib import admin
from .models import CustomUser, CustomUserManager
from.models import UserHealthInfo

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(UserHealthInfo)

