import os
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from catalog.models import Garment
from .serializers import GarmentSerializer
from dotenv import load_dotenv

load_dotenv()

class GarmentListView(APIView):
    """
    Returns the catalog of clothes for the UI.
    Now uses standard local media paths.
    """
    def get(self, request):
        garments = Garment.objects.all()
        # The serializer context ensures URLs are built correctly for the environment
        serializer = GarmentSerializer(garments, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class VirtualTryOnAPI(APIView):
    """
    Independent Layer connecting React to the AI service.
    Bypass headers for ngrok have been removed.
    """
    def post(self, request):
        # 1. Get the user's selfie and the selected garment's image URL
        user_photo = request.FILES.get('image')
        garment_url = request.data.get('garment_url')

        if not user_photo or not garment_url:
            return Response({"error": "Missing image or garment selection"}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Setup standard RapidAPI credentials
        url = "https://virtual-try-on7.p.rapidapi.com/results"
        headers = {
            "x-rapidapi-key": os.getenv("RAPIDAPI_KEY"),
            "x-rapidapi-host": os.getenv("RAPIDAPI_HOST"),
            # ngrok-skip-browser-warning removed as it is no longer needed
        }

        # 3. Call the external AI service
        files = {
            "image": user_photo,
            "url-apparel": (None, garment_url) 
        }

        try:
            response = requests.post(url, files=files, headers=headers)
            ai_data = response.json()

            # DEBUG: Check the raw response in your terminal
            print("AI Raw Response:", ai_data)

            # 4. Extracting the URL from the response structure
            if "results" in ai_data and len(ai_data["results"]) > 0:
                first_result = ai_data["results"][0]
                
                # Check for nested entities structure
                if isinstance(first_result, dict) and "entities" in first_result:
                    entities = first_result.get("entities", [])
                    if entities and len(entities) > 0:
                        generated_url = entities[0].get("image")
                        return Response({"url": generated_url}, status=status.HTTP_200_OK)
                
                # Check if the result is a direct URL string
                if isinstance(first_result, str):
                    return Response({"url": first_result}, status=status.HTTP_200_OK)
            
            return Response({"error": "AI failed to process. Ensure the garment URL is publicly accessible.", "raw": ai_data}, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)