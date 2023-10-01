from .models import Credential
from rest_framework import serializers, generics
from .serializer import  CredentialSerializer
import hashlib
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
# Create your views here.

class CredentialCreate(generics.CreateAPIView):
    queryset= Credential.objects.all()
    serializer_class=CredentialSerializer


class CredentialRetrieve(generics.RetrieveAPIView):

    queryset=Credential.objects.all()
    serializer_class= CredentialSerializer
    
    
    def get_object(self):
        # Retrieve the 'pk' parameter from the URL kwargs
        pk = self.kwargs.get('pk')    
        # Hash the retrieved 'pk' parameter    
        pk = hashlib.sha256(str(pk).encode()).hexdigest()
        obj = get_object_or_404(Credential, privatekey=pk)
        return obj