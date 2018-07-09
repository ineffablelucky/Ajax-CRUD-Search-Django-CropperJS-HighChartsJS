from rest_framework import serializers
from .models import Person


class PersonSerializer(serializers.ModelSerializer):

    class Meta:

        model = Person
        fields = '__all__'

    def validate_name(self, value):
        return value.title()

