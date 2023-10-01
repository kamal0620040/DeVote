from django.db import models
import hashlib
# Create your models here.


class Credential(models.Model):
    privatekey= models.CharField(max_length=240, null=False, blank=False)
    citizenshipImage=models.URLField()
    currentPhoto=models.URLField()
    
    def save(self, *args, **kwargs):
        # Hash the value before saving it
        self.privatekey = hashlib.sha256(self.privatekey.encode()).hexdigest()
        super().save(*args, **kwargs)