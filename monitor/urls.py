from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('iniciar-captura/', views.iniciar_captura, name='iniciar_captura'),
    path('detener-captura/', views.detener_captura, name='detener_captura'),
    path('obtener-datos/', views.obtener_datos, name='obtener_datos'),
]
