from django.urls import path
from .views import PeopleList, delete, create, update

urlpatterns = [
    path('', PeopleList, name='people_list'),
    path('update/<int:id>', view=update, name='update'),
    path('delete/<int:pk>', view=delete, name='delete'),
    path('create/', view=create, name='create'),

]
