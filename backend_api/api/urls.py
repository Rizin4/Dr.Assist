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
    path('chatbot-token/', views.generate_custom_access_token, name='chatbot_token'),
    path('report-gallery/', views.report_gallery, name='report_gallery'),
    path('report-gallery/<int:pk>/', views.delete_report, name='delete_report'),
    path('share-report-with-doctor/', views.share_report_with_doctor, name='share_report_with_doctor'),
    path('view-received-pdfs/', views.view_received_pdfs, name='view_received_pdfs'),
    path('view-pdf/<int:pdf_id>/', views.view_selected_pdf, name='view_selected_pdf'),
    path('test/', views.testEndPoint, name='test'),
    path('', views.getRoutes),
]