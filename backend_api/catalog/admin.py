from django.contrib import admin
from django.utils.html import format_html
from .models import Garment, GarmentVariant # Import both models

# 1. Create the Inline for Variants
class GarmentVariantInline(admin.TabularInline):
    model = GarmentVariant
    extra = 4  # Displays 4 empty rows by default for your 4 colors
    fields = ('color_name', 'color_hex', 'variant_image', 'image_preview')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.variant_image:
            return format_html('<img src="{}" style="width: 40px; height: auto; border-radius: 4px;" />', obj.variant_image.url)
        return "No Image"

@admin.register(Garment)
class GarmentAdmin(admin.ModelAdmin):
    # Add the Inline to the main Garment page
    inlines = [GarmentVariantInline]
    
    list_display = ('image_tag', 'name', 'category', 'price', 'fabric_type') 
    list_filter = ('category',)
    search_fields = ('name',)

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: auto; border-radius: 4px;" />', obj.image.url)
        return "No Image"

    image_tag.short_description = 'Preview'