from django.urls import path
# This line is the fix: it imports the views you created
from .views import VirtualTryOnAPI, GarmentListView 

urlpatterns = [
    # Path for AI generation
    path('generate/', VirtualTryOnAPI.as_view(), name='tryon-generate'),
    
    # Path for your garment catalog
    path('garments/', GarmentListView.as_view(), name='garment-list'),
]