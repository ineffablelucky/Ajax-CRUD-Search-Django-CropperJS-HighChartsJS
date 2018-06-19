from django.shortcuts import redirect
from django.views.generic import ListView
from .models import Person
from django.contrib import messages


class PeopleList(ListView):
    model = Person
    template_name = 'ajax_submit_search_app/name_list.html'
    context_object_name = 'people'


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
        print("------------name", name)
        date = request.POST['date']
        print("++++++++++++date", date)

        Person.objects.create(name=name, dob=date)

        return redirect('people_list')
