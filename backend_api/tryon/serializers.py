from rest_framework import serializers
from catalog.models import Garment, GarmentVariant

# 1. for the color variants 
class GarmentVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = GarmentVariant
        fields = ['id', 'color_name', 'color_hex', 'variant_image']

# 2. Main Serializer for both Ready-Made and Bespoke Results
class GarmentSerializer(serializers.ModelSerializer):
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
            'gender',
            'fabric_type_label', 
            'available_sizes', 
            'variants'
        ]

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None