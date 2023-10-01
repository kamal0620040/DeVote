from rest_framework import serializers

from .imgApiHelper import driver
from .models import ImageSimilar
class ImageSimilarSerializer(serializers.ModelSerializer):
    Result=serializers.SerializerMethodField()
    x=None
    class Meta:
        model= ImageSimilar
        fields=['img1', 'img2', 'Result']
        

    def get_Result(self, object):
        return x
    
    def validate(self, data):
        global x
        x= driver(data['img1'], data['img2'])


        return super().validate(data)
