import os
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from catalog.models import Garment
from dotenv import load_dotenv

load_dotenv()

class GarmentListView(APIView):
    """
    Returns the catalog of clothes (Men, Women, Kids) for the UI.
    """
    def get(self, request):
        # Fetch all garments from your database
        garments = Garment.objects.all().values('id', 'name', 'category', 'image', 'price')
        
        # Ensure image URLs are absolute so React can load them
        for g in garments:
            if g['image']:
                g['image'] = request.build_absolute_uri(settings.MEDIA_URL + g['image'])
        
        return Response(garments, status=status.HTTP_200_OK)

class VirtualTryOnAPI(APIView):
    """
    The Independent Layer that wraps the API4AI service.
    """
    def post(self, request):
        # 1. Get the user's selfie and the selected garment's image URL
        user_photo = request.FILES.get('image')
        garment_url = request.data.get('garment_url')

        if not user_photo or not garment_url:
            return Response(
                {"error": "Missing image or garment selection"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Setup the RapidAPI credentials from your screenshot
        url = "https://virtual-try-on7.p.rapidapi.com/results"
        headers = {
            "x-rapidapi-key": os.getenv("RAPIDAPI_KEY"),
            "x-rapidapi-host": os.getenv("RAPIDAPI_HOST"),
        }

        # 3. Call the API4AI service using Multipart encoding
        # We send both the image file and the garment URL in the 'files' dictionary
        files = {
            "image": user_photo,
            "url-apparel": (None, garment_url) 
        }

        try:
            # Note: Do not use 'data=' here; 'files=' handles the full request
            response = requests.post(url, files=files, headers=headers)
            
            # 4. Return the AI result back to your UI
            return Response(response.json(), status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )