from rest_framework import serializers
from catalog.models import Garment, GarmentVariant

# 1. Create a serializer for the color variants
class GarmentVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = GarmentVariant
        fields = ['id', 'color_name', 'color_hex', 'variant_image']

class GarmentSerializer(serializers.ModelSerializer):
    # This pulls in all variants linked to this garment
    variants = GarmentVariantSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Garment
        fields = [
            'id', 
            'name', 
            'category', 
            'image', 
            'price', 
            'fabric_type', 
            'available_sizes', 
            'variants'  # Use 'variants' instead of 'available_colors'
        ]

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None