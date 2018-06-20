from django.shortcuts import redirect, render, get_object_or_404
from django.http import JsonResponse
from .models import Person
from django.contrib import messages
from django.views.generic import DetailView

def PeopleList(request):
    data = Person.objects.all()
    return render(request, 'ajax_submit_search_app/name_list.html', {'people': data})


def update(request, id):
    if request.method == "POST":
        name = request.POST['name']
        print('++++++name', name)
        date = request.POST.get('date')
        print('----date', date)

        person_obj = Person.objects.get(id=id)
        person_obj.dob = date
        person_obj.name = name
        person_obj.save()
        data = {'name': name, 'date': date, 'id': person_obj.id}

        return JsonResponse(data)


def delete(request, pk):
    try:
        person_obj = Person.objects.get(id=pk)
        person_obj.delete()
        messages.warning(request, 'Deleted company: {}'.format(person_obj))

    except Exception as e:
        messages.warning(request, 'Got an error when trying to delete a company: {}.'.format(e))

    return redirect('people_list')


def create(request):
    if request.method == "POST":
        name = request.POST['name']
        print('++++++name', name)
        date = request.POST.get('date')
        print(date)

        person_obj = Person.objects.create(name=name, dob=date)
        print(person_obj.dob)
        data = {'name': name, 'date': date, 'id': person_obj.id}

        return JsonResponse(data)

