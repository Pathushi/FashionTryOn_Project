from django.db import models
from django.core.exceptions import ValidationError

class BespokeAttribute(models.Model):
    ATTRIBUTE_TYPES = [
        ('FABRIC', 'Fabric Swatch'),
        ('COLLAR', 'Collar Style'),
        ('BUTTON', 'Button Type'),
        ('CUFF', 'Cuff Style'),
        ('SLEEVE', 'Sleeve Style'),
    ]
    
    name = models.CharField(max_length=100)
    attr_type = models.CharField(max_length=20, choices=ATTRIBUTE_TYPES)
    color_hex = models.CharField(max_length=7, blank=True, null=True, help_text="e.g. #0000FF for blue")
    image = models.ImageField(upload_to='bespoke/attributes/')
    
    def __str__(self):
        return f"{self.get_attr_type_display()}: {self.name}"

class Garment(models.Model):
    CATEGORY_CHOICES = [
        ('SHIRT', 'Shirt'),
        ('TROUSER', 'Trouser'),
        ('SUIT', 'Suit'),
        ('BLAZER', 'Blazer'),
        ('TSHIRT', 'Tshirt'),
    ]
    
    FINISHING_CHOICES = [
        ('READY-MADE', 'Ready-Made'),
        ('BESPOKE', 'Bespoke'),
    ]

    GENDER_CHOICES = [
        ('MEN', 'Men'),
        ('WOMEN', 'Women'),
        ('KIDS', 'Kids'),
    ]
    
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    finishing_method = models.CharField(max_length=20, choices=FINISHING_CHOICES, default='READY-MADE')
    
    # Gender field
    gender = models.CharField(
        max_length=10, 
        choices=GENDER_CHOICES, 
        blank=True, 
        null=True
    )
    
    image = models.ImageField(upload_to='garments/')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    description = models.TextField(blank=True, null=True)
    fabric_type_label = models.CharField(max_length=100, default="Premium Selection")
    available_sizes = models.CharField(max_length=100, default="S,M,L,XL")

    # BESPOKE MATCHING FIELDS 
    fabric_attr = models.ForeignKey(BespokeAttribute, on_delete=models.SET_NULL, null=True, blank=True, related_name='garment_fabric')
    collar_attr = models.ForeignKey(BespokeAttribute, on_delete=models.SET_NULL, null=True, blank=True, related_name='garment_collar')
    cuff_attr = models.ForeignKey(BespokeAttribute, on_delete=models.SET_NULL, null=True, blank=True, related_name='garment_cuff')
    button_attr = models.ForeignKey(BespokeAttribute, on_delete=models.SET_NULL, null=True, blank=True, related_name='garment_button')

    def clean(self):
        """Logic to ensure only Ready-Made has gender assigned"""
        if self.finishing_method == 'READY-MADE' and not self.gender:
            raise ValidationError({'gender': 'Ready-made items must have a gender assigned.'})
        if self.finishing_method == 'BESPOKE' and self.gender:
            
            self.gender = None 

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.finishing_method}] {self.name}"

class GarmentVariant(models.Model):
    garment = models.ForeignKey(Garment, related_name='variants', on_delete=models.CASCADE)
    color_name = models.CharField(max_length=50)
    color_hex = models.CharField(max_length=7)
    variant_image = models.ImageField(upload_to='garments/variants/')

    def __str__(self):
        return f"{self.garment.name} - {self.color_name}"

# Proxy Models for Admin Organization 

class ReadyMadeGarment(Garment):
    class Meta:
        proxy = True
        verbose_name = "Ready-Made Item"
        verbose_name_plural = "01. Ready-Made Collection"

class BespokeGarment(Garment):
    class Meta:
        proxy = True
        verbose_name = "Bespoke Result Shirt"
        verbose_name_plural = "02. Bespoke Result Shirts"

class BespokePalette(BespokeAttribute):
    class Meta:
        proxy = True
        verbose_name = "Bespoke Attribute"
        verbose_name_plural = "03. Bespoke Attributes (Fabrics/Features)"