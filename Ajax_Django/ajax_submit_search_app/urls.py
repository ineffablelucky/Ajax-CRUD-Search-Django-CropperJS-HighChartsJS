from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import people_list, delete, create, update, search, PersonSerializerView

urlpatterns = [
    path('', view=people_list, name='people_list'),
    path('update/', view=update, name='update'),
    path('delete/<int:pk>', view=delete, name='delete'),
    path('create/', view=create, name='create'),
    path('search/', view=search, name='search'),
    path('api/', view=PersonSerializerView.as_view(), name='api_get')

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
