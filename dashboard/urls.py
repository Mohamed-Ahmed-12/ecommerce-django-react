from . import views
from django.urls import path
urlpatterns = [
    path('dashboard/',views.DashboardView.as_view() , name='dashboard'), 
]
