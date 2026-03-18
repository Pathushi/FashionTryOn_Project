import os
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from catalog.models import Garment, BespokeAttribute
from .serializers import GarmentSerializer

class GarmentListView(APIView):
    """
    Standard Gallery View.
    Added Gender filtering for Ready-Made items.
    """
    def get(self, request):
        method = request.query_params.get('method', 'READY-MADE')
        category = request.query_params.get('category')
        gender = request.query_params.get('gender') 
        
        garments = Garment.objects.filter(finishing_method=method.upper())
        
        if category:
            garments = garments.filter(category=category.upper())
        if gender:
            garments = garments.filter(gender=gender.upper())
            
        serializer = GarmentSerializer(garments, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class BespokeOptionsView(APIView):
    def get(self, request):
        attributes = BespokeAttribute.objects.all()
        data = [{
            "id": c.id,
            "name": c.name,
            "type": c.attr_type,
            "color": c.color_hex,
            "image": request.build_absolute_uri(c.image.url)
        } for c in attributes]
        return Response(data, status=status.HTTP_200_OK)

class BespokeFindMatchView(APIView):
    """
    The 'Matching Engine'. 
    Updated to include button_id in the search filter.
    """
    def post(self, request):
        fabric_id = request.data.get('fabric_id')
        collar_id = request.data.get('collar_id')
        cuff_id = request.data.get('cuff_id')
        button_id = request.data.get('button_id')
        category = request.data.get('category', 'SHIRT')

        try:
            match = Garment.objects.get(
                finishing_method='BESPOKE',
                category=category.upper(),
                fabric_attr_id=fabric_id,
                collar_attr_id=collar_id,
                cuff_attr_id=cuff_id,
                button_attr_id=button_id 
            )
            
            serializer = GarmentSerializer(match, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Garment.DoesNotExist:
            return Response(
                {"error": "This specific combination is not available in our collection."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class VirtualTryOnAPI(APIView):
    """
    The Bridge to the external AI Service.
    CRITICAL: Handles URL conversion for Localhost.
    """
    def post(self, request):
        user_photo = request.FILES.get('image')
        garment_url = request.data.get('garment_url')

        if not user_photo or not garment_url:
            return Response({"error": "Missing image or garment selection"}, status=status.HTTP_400_BAD_REQUEST)

        # AI gets a full URL
        if not garment_url.startswith('http'):
            garment_url = request.build_absolute_uri(garment_url)
        
        # NOTE: If testing on localhost, RapidAPI will fail to download your image.
        # Use an ngrok tunnel or a live image URL for testing this specific endpoint.

        url = "https://virtual-try-on7.p.rapidapi.com/results"
        headers = {
            "x-rapidapi-key": os.getenv("RAPIDAPI_KEY"),
            "x-rapidapi-host": os.getenv("RAPIDAPI_HOST"),
        }

        files = {
            "image": ("user_photo.jpg", user_photo, "image/jpeg"),
            "url-apparel": (None, garment_url) 
        }

        try:
            response = requests.post(url, files=files, headers=headers)
            ai_data = response.json()
            
            # Print AI response to terminal
            print("AI RESPONSE:", ai_data)

            if "results" in ai_data and len(ai_data["results"]) > 0:
                first_result = ai_data["results"][0]
                if isinstance(first_result, dict) and "entities" in first_result:
                    generated_url = first_result["entities"][0].get("image")
                    return Response({"url": generated_url}, status=status.HTTP_200_OK)
            
            return Response({
                "error": "AI failed to process. Ensure your garment image is publicly accessible.", 
                "details": ai_data
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)