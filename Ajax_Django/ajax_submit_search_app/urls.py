from django.urls import path
from .views import people_list, delete, create, update, search

urlpatterns = [
    path('', view=people_list, name='people_list'),
    path('update/', view=update, name='update'),
    path('delete/<int:pk>', view=delete, name='delete'),
    path('create/', view=create, name='create'),
    path('search/', view=search, name='search'),

]
