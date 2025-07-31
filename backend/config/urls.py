from django.contrib import admin
from django.urls import path, include


from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/stories/', include('stories.urls')),
    path('api/microgrants/', include('microgrants.urls')),
    path('api/mentor/', include('mentor.urls')),
    path('api/youth/', include('youth.urls')),
    path('api/donor/', include('donor.urls')),
    path('api/healing/', include('healing.urls')),
    path('api/learning/', include('learning.urls')),
    path('api/dashboard/', include('dashboard.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

