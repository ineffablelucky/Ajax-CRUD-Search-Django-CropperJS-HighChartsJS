from django.shortcuts import render
from django.http import JsonResponse
from .models import Person
from .forms import UpdateForm
from django.core import serializers
from PIL import Image
import base64
from django.core.files.base import ContentFile
from datetime import datetime
# https://docs.djangoproject.com/en/2.0/ref/models/querysets/#field-lookups
# https://www.highcharts.com/demo/3d-column-null-values/dark-unica

# imports related to DRF

from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import PersonSerializer
from rest_framework import status


def month_list():  # not a view function
    frequency = []
    for month in range(1, 13):
        queryset_count = Person.objects.filter(dob__month=month).count()
        frequency.append(queryset_count)

    return frequency


def people_list(request):
    people = Person.objects.all()
    return render(request, 'ajax_submit_search_app/name_list.html', {'people': people, 'freq': month_list()})


def create(request):
    if request.method == "POST":

        name = request.POST['name'].title()
        date = request.POST.get('date')

        try:
            if request.POST['cropped_img']:
                # cropped image in base 64 format_type
                file = request.POST.get("cropped_img")
                format_type, img_str = file.split(';base64,')
                ext = format_type.split('/')[-1]
                date_time = datetime.now()
                image_file = ContentFile(base64.b64decode(img_str), name='cover' + str(date_time) + '.' + ext)

                Image.open(image_file).verify()  # verifying the image format_type

                person_obj = Person.objects.create(name=name, dob=date, image=image_file)

            else:
                person_obj = Person.objects.create(name=name, dob=date)

            data = {'name': name, 'date': date, 'id': person_obj.id, 'frequency': month_list(), 'message': 'successful'}

        except:
            data = {'message': 'fail'}

        return JsonResponse(data)

    else:
        data = {'message': 'invalid request'}
        return JsonResponse(data)


def update(request):
    # < QueryDict: {'csrfmiddlewaretoken': ['SZw8DViiuPlSpFTtoeu9DFXlDVE0L63R8W38UOhXyatquOPKmTnrr3T5hAj1cGPq'],
    #              'company_name': ['doe'], 'year': ['2010']} >

    if request.method == "POST":

        name = request.POST['name']
        date = request.POST.get('dob')
        csrf = request.POST.get('csrfmiddlewaretoken')
        obj_id = request.POST.get('id')

        update_dict = {
            'csrfmiddlewaretoken': csrf,
            'name': name,
            'dob': date
        }

        try:
            person_obj = Person.objects.get(id=obj_id)
            form = UpdateForm(update_dict, instance=person_obj)

            if form.is_valid():
                form.save(commit=True)

            data = {'name': person_obj.name, 'date': person_obj.dob, 'frequency': month_list(), 'id': person_obj.id,
                    'message': 'successful'}

        except:
            data = {'message': 'fail'}

        return JsonResponse(data)

    else:
        data = {'message': 'invalid request'}
        return JsonResponse(data)


def delete(request, pk):
    if request.method == "POST":

        try:
            person_obj = Person.objects.get(id=pk)
            person_obj.delete()
            data = {'message': 'successful', 'frequency': month_list()}

        except:
            data = {'message': 'fail'}

        return JsonResponse(data)

    else:
        data = {'message': 'invalid request'}
        return JsonResponse(data)


def search(request):
    if request.method == "POST":

        query = request.POST.get('search_input')
        queryset = Person.objects.filter(name__istartswith=query)

        if not queryset:
            data = {'message': 'No Results'}
        else:
            result = serializers.serialize('json', queryset)
            data = {'message': 'successful', 'result': result}

        return JsonResponse(data)

    else:
        data = {'message': 'invalid request'}
        return JsonResponse(data)


class PersonSerializerView(APIView):

    def get(self, request):

        person_objects = Person.objects.all()
        serializer_data = PersonSerializer(person_objects, many=True)
        return Response(serializer_data.data)

    def post(self, request):
        serializer = PersonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
