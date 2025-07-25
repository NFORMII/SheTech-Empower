from django.contrib import admin
from .models import MoodCheckIn, JournalEntry, SupportPost, SupportReply

# Register your models here.
admin.site.register(MoodCheckIn)
admin.site.register(JournalEntry)
admin.site.register(SupportPost)
admin.site.register(SupportReply)
