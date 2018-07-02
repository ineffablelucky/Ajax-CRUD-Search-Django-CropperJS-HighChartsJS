from django.db import models


# Create your models here.
class Person(models.Model):

    name = models.CharField(max_length=100)
    dob = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to='user_images', blank=True, null=True)

    def __str__(self):
        return '%s' % self.name
