from . import views
from django.urls import path
urlpatterns = [
    path('dashboard/',views.DashboardView.as_view() , name='dashboard'), 
    path('history/',views.ProductsPriceHistoryView.as_view() , name='history'),
]
