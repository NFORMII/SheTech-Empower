from django.contrib import admin
from .models import MicrograntApplication, SuccessStory

admin.site.register(MicrograntApplication)

@admin.register(SuccessStory)
class SuccessStoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'business', 'amount', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['name', 'business']
