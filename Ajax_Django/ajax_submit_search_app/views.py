from django.shortcuts import render
from django.http import JsonResponse
from .models import Person
from .forms import UpdateForm
from django.core import serializers
from PIL import Image


def people_list(request):
    data = Person.objects.all()
    return render(request, 'ajax_submit_search_app/name_list.html', {'people': data})


def create(request):
    if request.method == "POST":

        name = request.POST['name'].title()
        date = request.POST.get('date')
        image = request.FILES['pic']

        try:
            Image.open(image).verify()  # verifying the image format
            person_obj = Person.objects.create(name=name, dob=date, image=image)
            data = {'name': name, 'date': date, 'id': person_obj.id, 'message': 'successful'}

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

            data = {'name': person_obj.name, 'date': person_obj.dob, 'id': person_obj.id, 'message': 'successful'}

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
            data = {'message': 'successful'}

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
