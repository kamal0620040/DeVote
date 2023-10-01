from rest_framework import serializers
from .models import  Credential




class CredentialSerializer(serializers.ModelSerializer):
    # poster=serializers.WriteOnlyField(source='Credential.privatekey')

    class Meta:
        model=Credential
        fields=['id', 'privatekey', 'citizenshipImage', 'currentPhoto']
        extra_kwargs={
            'privatekey':{'write_only':True}
        }
