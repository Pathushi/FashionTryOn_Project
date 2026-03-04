from django.urls import path
from .views import VirtualTryOnAPI

urlpatterns = [
    path('generate/', VirtualTryOnAPI.as_view(), name='tryon-generate'),
]