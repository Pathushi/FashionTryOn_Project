from rest_framework import serializers
from catalog.models import Garment

class GarmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Garment
        fields = ['id', 'name', 'category', 'image', 'price']