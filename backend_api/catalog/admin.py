from django.contrib import admin
from django.utils.html import format_html # Import this for HTML support
from .models import Garment

@admin.register(Garment)
class GarmentAdmin(admin.ModelAdmin):
    # Add 'image_tag' to the list_display
    list_display = ('image_tag', 'name', 'category', 'price') 
    list_filter = ('category',)
    search_fields = ('name',)

    # Create the thumbnail function
    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: auto; border-radius: 4px;" />', obj.image.url)
        return "No Image"

    image_tag.short_description = 'Preview' # Changes the column header name