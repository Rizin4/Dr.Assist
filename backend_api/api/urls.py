from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('list-doctors/', views.list_doctors, name='list_doctors'),
    path('generate-pdf/', views.generate_pdf, name='generate_pdf'),
    path('test/', views.testEndPoint, name='test'),
    path('', views.getRoutes),
]