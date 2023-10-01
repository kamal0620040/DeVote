from django.db import models

# Create your models here.


class ImageSimilar(models.Model):
    img1=models.CharField(max_length=150000)
    img2=models.URLField()