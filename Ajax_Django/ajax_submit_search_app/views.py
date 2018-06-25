from django.shortcuts import render
from django.http import JsonResponse
from .models import Person
from .forms import UpdateForm


def people_list(request):
    data = Person.objects.all()
    return render(request, 'ajax_submit_search_app/name_list.html', {'people': data})


def create(request):

    if request.method == "POST":

        name = request.POST['name']
        date = request.POST.get('date')

        try:
            person_obj = Person.objects.create(name=name, dob=date)
            data = {'name': name, 'date': date, 'id': person_obj.id, 'message': 'successful'}

        except:
            data = {'message': 'fail'}

        return JsonResponse(data)

    else:
        data = {'message': 'invalid request'}
        return JsonResponse(data)


def update(request):

    #< QueryDict: {'csrfmiddlewaretoken': ['SZw8DViiuPlSpFTtoeu9DFXlDVE0L63R8W38UOhXyatquOPKmTnrr3T5hAj1cGPq'],
    #              'company_name': ['doe'], 'year': ['2010']} >

    if request.method == "POST":

        name = request.POST['name']
        date = request.POST.get('dob')
        csrf = request.POST.get('csrfmiddlewaretoken')
        print(csrf)
        obj_id = request.POST.get('id')

        dict = {
            'csrfmiddlewaretoken': csrf,
            'name': name,
            'dob': date
        }
        # person_obj = Person.objects.get(id=obj_id)
        # form = UpdateForm(dict, instance=person_obj)
        # if form.is_valid():
        #     form.save(commit=True)
        # print("44444", person_obj)
        # person_obj.dob = date
        # person_obj.name = name
        # # person_obj.save()
        # data = {'name': person_obj.name, 'date': person_obj.dob, 'id': person_obj.id, 'message': 'successful'}

        try:
            person_obj = Person.objects.get(id=obj_id)
            form = UpdateForm(dict, instance=person_obj)

            if form.is_valid():
                form.save(commit=True)
            print("44444", person_obj)

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
