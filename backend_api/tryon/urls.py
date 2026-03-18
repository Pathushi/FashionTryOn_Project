from django.urls import path
from .views import VirtualTryOnAPI, GarmentListView, BespokeOptionsView, BespokeFindMatchView

urlpatterns = [
    path('generate/', VirtualTryOnAPI.as_view(), name='tryon-generate'),
    path('garments/', GarmentListView.as_view(), name='garment-list'),
    path('bespoke-options/', BespokeOptionsView.as_view(), name='bespoke-options'),
    path('find-match/', BespokeFindMatchView.as_view(), name='bespoke-find-match'), # New!
]