from rest_framework import generics
from .serializer import ImageSimilarSerializer
from .models import ImageSimilar

class ImageSimilariView(generics.CreateAPIView):
    queryset= ImageSimilar.objects.all()
    serializer_class=ImageSimilarSerializer

    def perform_create(self, serializer):
        serializer.save()
        

    
