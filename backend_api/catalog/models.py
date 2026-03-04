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
    # The 'image' field stores the transparent PNG of the garment for the AI try-on
    image = models.ImageField(upload_to='garments/')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.category}"
