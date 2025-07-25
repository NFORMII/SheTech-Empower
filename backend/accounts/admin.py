from django.contrib import admin
from .models import User

# Register your models here.

# User模型的管理器
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass