from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Garment, GarmentVariant, 
    ReadyMadeGarment, BespokeGarment, 
    BespokeAttribute, BespokePalette
)


def get_thumbnail(obj):
    if obj.image:
        return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #eee;" />', obj.image.url)
    return "No Image"


class GarmentVariantInline(admin.TabularInline):
    model = GarmentVariant
    extra = 1  
    fields = ('color_name', 'color_hex', 'variant_image', 'image_preview')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.variant_image:
            return format_html('<img src="{}" style="width: 40px; height: auto; border-radius: 4px;" />', obj.variant_image.url)
        return "No Image"

# 01. READY-MADE ADMIN 
@admin.register(ReadyMadeGarment)
class ReadyMadeAdmin(admin.ModelAdmin):
    inlines = [GarmentVariantInline]
    
    list_display = ('image_tag', 'name', 'category', 'price', 'fabric_type_label')
    list_filter = ('category',)
    search_fields = ('name',)
    
    def image_tag(self, obj):
        return get_thumbnail(obj)
    image_tag.short_description = 'Preview'

    def get_queryset(self, request):
        return super().get_queryset(request).filter(finishing_method='READY-MADE')

    def save_model(self, request, obj, form, change):
        obj.finishing_method = 'READY-MADE'
        super().save_model(request, obj, form, change)

#  02. BESPOKE RESULT SHIRTS ADMIN 
@admin.register(BespokeGarment)
class BespokeAdmin(admin.ModelAdmin):
    # link the result shirt to its attributes
    list_display = ('fabric_tag', 'name', 'category', 'fabric_attr', 'collar_attr', 'cuff_attr')
    list_filter = ('category', 'fabric_attr', 'collar_attr')
    search_fields = ('name',)
    
    # Organize fields to make matching easier
    fields = (
        'name', 'category', 'image', 'price', 
        'fabric_type_label', 'available_sizes',
        'fabric_attr', 'collar_attr', 'cuff_attr', 'button_attr'
    )

    def fabric_tag(self, obj):
        return get_thumbnail(obj)
    fabric_tag.short_description = 'Final Result'

    def get_queryset(self, request):
        return super().get_queryset(request).filter(finishing_method='BESPOKE')

    def save_model(self, request, obj, form, change):
        obj.finishing_method = 'BESPOKE'
        super().save_model(request, obj, form, change)

# BESPOKE ATTRIBUTES (The Palette & Features) 
@admin.register(BespokeAttribute)
class BespokeAttributeAdmin(admin.ModelAdmin):
    list_display = ('attr_preview', 'name', 'attr_type', 'color_hex')
    list_filter = ('attr_type',)
    search_fields = ('name',)

    def attr_preview(self, obj):
        return get_thumbnail(obj)
    attr_preview.short_description = 'Swatch/Icon'