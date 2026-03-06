from django.db import models

class Garment(models.Model):
    CATEGORY_CHOICES = [
        ('MEN', 'Men'),
        ('WOMEN', 'Women'),
        ('KIDS', 'Kids'),
        ('ACCESSORIES', 'Accessories'),
        ('SHOES', 'Shoes'),
        ('SPORTS', 'Sportswear'),
    ]
    
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    # This acts as the "Main" default image
    image = models.ImageField(upload_to='garments/')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    description = models.TextField(blank=True, null=True)
    fabric_type = models.CharField(max_length=100, default="Premium Cotton")
    available_sizes = models.CharField(max_length=100, default="S,M,L,XL")

    def __str__(self):
        return self.name

class GarmentVariant(models.Model):
    # Link this variant to a specific Garment
    garment = models.ForeignKey(Garment, related_name='variants', on_delete=models.CASCADE)
    color_name = models.CharField(max_length=50) # e.g., "Red"
    color_hex = models.CharField(max_length=7)   # e.g., "#FF0000"
    # The actual photo of the shirt in THIS color
    variant_image = models.ImageField(upload_to='garments/variants/')

    def __str__(self):
        return f"{self.garment.name} - {self.color_name}"