# accounts/urls.py
from django.urls import path
from .views import login, register, logout, me

urlpatterns = [
    path('login/', login, name='login'),
    path('register/', register, name='register'),
    path('logout/', logout, name='logout'),
    path('me/', me, name='me'),

]
