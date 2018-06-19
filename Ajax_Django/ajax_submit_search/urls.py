from django.urls import path
from .views import PeopleList, delete, create

urlpatterns = [
    path('', PeopleList.as_view(), name='people_list'),
    path('delete/<int:pk>', view=delete, name='delete'),
    path('create/', view=create, name='create'),

]
