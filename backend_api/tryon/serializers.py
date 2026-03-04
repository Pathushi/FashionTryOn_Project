# backend_api/tryon/serializers.py
from rest_framework import serializers
from catalog.models import Garment

class GarmentSerializer(serializers.ModelSerializer):
    # This remains a SerializerMethodField to ensure we get the full local URL
    image = serializers.SerializerMethodField()

    class Meta:
        model = Garment
        fields = ['id', 'name', 'category', 'image', 'price']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            # If the request context exists, it builds: http://127.0.0.1:8000/media/...
            if request:
                return request.build_absolute_uri(obj.image.url)
            # Fallback to the relative path: /media/garments/shirt.jpg
            return obj.image.url
        return None