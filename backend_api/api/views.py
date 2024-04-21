from django.http import FileResponse
from django.shortcuts import get_object_or_404
from api.models import User
from api.serializer import MyTokenObtainPairSerializer, RegisterSerializer, ReportSerializer, UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.files.base import ContentFile
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Frame, Spacer
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.lib import colors
from .permissions import IsDoctor, IsPatient
from .models import Report
from rest_framework_simplejwt.tokens import AccessToken
import io
from .utils import generate_custom_jwt_payload


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        # Add the 'isDoctor' field to the serializer data
        serializer.save()

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Get All Routes
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/'
    ]
    return Response(routes)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = "Hello buddy"
        data = f'Congratulation your API just responded to POST request with text: {text}'
        return Response({'response': data}, status=status.HTTP_200_OK)
    return Response({}, status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_doctors(request):
    if request.method == 'GET':
        doctors = User.objects.filter(isDoctor=True)
        serializer = UserSerializer(doctors, many=True)
        return Response(serializer.data)
    return Response({}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPatient])
def generate_pdf(request):
    if request.method == 'POST':

        # Retrieve chatbot summary
        chatbot_summary = request.data.get('chatbot_summary')         
        
        # Fetch user details from the authenticated user
        user = request.user
        user_details = {

            "full_name": user.profile.full_name,
            "username" : user.username,
            "email" : user.email,
            "gender": user.profile.gender,
        }

        # Generate the PDF content
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []

        # styles = getSampleStyleSheet()
        # # styles = {
        # #     'Title': ParagraphStyle(
        # #         name='Title',
        # #         fontSize=16,
        # #         leading=20
        # #     ),
        # #     'Heading1': ParagraphStyle(
        # #         name='Heading1',
        # #         fontSize=15,
        # #         leading=20
        # #     ),
        # #     'Normal': ParagraphStyle(
        # #         name='Normal',
        # #         fontSize=12,
        # #         leading=14
        # #     ),
        # # }

        # elements.append(Paragraph("Patient Details", styles['Title']))
        # elements.append(Paragraph(f"Name: {user_details['full_name']}", styles['Normal']))
        # elements.append(Paragraph(f"Username: {user_details['username']}", styles['Normal']))
        # elements.append(Paragraph(f"Email: {user_details['email']}", styles['Normal']))
        # elements.append(Paragraph(f"Gender: {user_details['gender']}", styles['Normal']))
        # for category, info in chatbot_summary['patient_info'].items():
        #     elements.append(Paragraph(f"{category.replace('_', ' ').capitalize()}: {info}", styles['Normal']))
        # elements.append(Spacer(1, 12))
        # elements.append(Paragraph("Case Report", styles['Title']))
        # # elements.append(Paragraph(chatbot_summary, styles['Normal']))
        # elements.append(Paragraph("allergies", styles['Title']))
        # for category, info in chatbot_summary['allergies'].items():
        #     elements.append(Paragraph(f"{category.replace('_', ' ').capitalize()}: {info}", styles['Normal']))
        # elements.append(Paragraph("Current_medication", styles['Heading1']))
        # elements.append(Paragraph(chatbot_summary.get('Current_medication', 'unspecified'), styles['Normal']))
        # elements.append(Paragraph("symptoms", styles['Title']))
        # for category, info in chatbot_summary['symptoms'].items():
        #     elements.append(Paragraph(f"{category.replace('_', ' ').capitalize()}: {info}", styles['Normal']))
        # elements.append(Paragraph("medical_history", styles['Title']))
        # for category, info in chatbot_summary['medical_history'].items():
        #     elements.append(Paragraph(f"{category.replace('_', ' ').capitalize()}: {info}", styles['Normal']))
        # elements.append(Paragraph("lifestyle", styles['Title']))
        # for category, info in chatbot_summary['lifestyle'].items():
        #     elements.append(Paragraph(f"{category.replace('_', ' ').capitalize()}: {info}", styles['Normal']))
        # elements.append(Paragraph("social_determinants", styles['Title']))
        # for category, info in chatbot_summary['social_determinants'].items():
        #     elements.append(Paragraph(f"{category.replace('_', ' ').capitalize()}: {info}", styles['Normal']))
        # elements.append(Paragraph("Added Info:", styles['Heading1']))
        # elements.append(Paragraph(chatbot_summary.get('added_info'), styles['Normal']))

        # Define custom styles
        styles = getSampleStyleSheet()
        custom_title_style = ParagraphStyle(
            name='CustomTitle',
            parent=styles['Title'],
            fontSize=16,
            textColor='navy',
            spaceAfter=12
        )
        custom_normal_style = ParagraphStyle(
            name='CustomNormal',
            parent=styles['Normal'],
            fontSize=12,
            textColor='black',
            spaceAfter=6
        )

        # Use custom styles in the PDF generation
        elements.append(Paragraph("Patient Details", custom_title_style))
        elements.append(Paragraph(f"Name: {user_details['full_name']}", custom_normal_style))
        elements.append(Paragraph(f"Username: {user_details['username']}", custom_normal_style))
        elements.append(Paragraph(f"Email: {user_details['email']}", custom_normal_style))
        elements.append(Paragraph(f"Gender: {user_details['gender']}", custom_normal_style))

        # Print patient_info before the loop
        patient_info = chatbot_summary.get('patient_info', {})
        for category, info in patient_info.items():
            elements.append(Paragraph(f"{category.replace('_', ' ').capitalize()}: {info}", custom_normal_style))

        elements.append(Paragraph("Case Report", custom_title_style))

        # Add sections from chatbot summary
        for section_name, section_data in chatbot_summary.items():
            if section_name != 'patient_info':  # Skip patient_info as it's already printed
                elements.append(Paragraph(section_name.capitalize(), custom_title_style))
                if isinstance(section_data, dict):
                    for field_name, field_value in section_data.items():
                        elements.append(Paragraph(f"{field_name.capitalize()}: {field_value}", custom_normal_style))
                else:
                    elements.append(Paragraph(section_data, custom_normal_style))

        doc.build(elements)
        
        # Convert the file object to Django File object
        pdf_content = buffer.getvalue()
        pdf_file = ContentFile(pdf_content)

        # Save the generated PDF to the database
        pdf_report = Report(user=request.user)
        pdf_report.file.save('report.pdf', pdf_file)
        pdf_report.save()

        # Serialize the saved PDF report
        serializer = ReportSerializer(pdf_report)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_custom_access_token(request):
    user = request.user

    # Generate access token for the user
    access_token = AccessToken.for_user(user)

    # Retrieve creation time of the login access token
    login_access_token_created_at = access_token['exp']

    # Generate custom payload
    payload = generate_custom_jwt_payload(access_token, user, login_access_token_created_at)

    # Attach custom payload to access token
    access_token.payload.update(payload)

    return Response({'custom_access_token': str(access_token)}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPatient])
def report_gallery(request):
    if request.method == 'GET':
        patient = request.user
        patient_pdfs = Report.objects.filter(user=patient)
        serializer = ReportSerializer(patient_pdfs, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_report(request, pk):
    try:
        report = Report.objects.get(pk=pk)

        if request.user == report.user:
            report.delete()

            return Response({'message': 'Report deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'You are not authorized to delete this report.'}, status=status.HTTP_403_FORBIDDEN)
    except Report.DoesNotExist:
        return Response({'error': 'Report not found.'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def share_report_with_doctor(request):
    # Extract report_id and doctor_id from request data
    report_id = request.data.get('report_id')
    doctor_id = request.data.get('doctor_id')
    
    try:
        # Retrieve the PDF report from the database
        report = Report.objects.get(id=report_id)
        
        # Check if the authenticated user is the owner of the report
        if request.user != report.user:
            return Response({'error': 'You are not the owner of this report.'}, status=status.HTTP_403_FORBIDDEN)
        
        # Check if the chosen doctor exists and is a registered doctor
        doctor = User.objects.get(id=doctor_id, isDoctor=True)
        
        # Share the report with the chosen doctor (update report in database)
        report.shared_with.add(doctor)
        report.save()
        
        # Optionally, you can return the updated report details in the response
        serializer = ReportSerializer(report)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Report.DoesNotExist:
        return Response({'error': 'Report not found.'}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({'error': 'Chosen doctor not found or is not registered as a doctor.'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsDoctor])
def view_received_pdfs(request):
    # Ensure that only authenticated doctor users can access this endpoint
    if request.method == 'GET':
        # Retrieve the authenticated doctor user
        doctor = request.user

        # Retrieve all PDF reports shared with the doctor
        received_reports = Report.objects.filter(shared_with=doctor)

        # Serialize the reports along with user details
        serialized_reports = ReportSerializer(received_reports, many=True)

        return Response(serialized_reports.data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPatient])
def view_selected_pdf(request, pdf_id):
    # Retrieve the selected PDF from the Report gallery
    pdf = get_object_or_404(Report, id=pdf_id, user=request.user)

    # Serve the PDF file as a response
    try:
        return FileResponse(open(pdf.file.path, 'rb'), content_type='application/pdf')
    except FileNotFoundError:
        return Response({'error': 'PDF file not found'}, status=status.HTTP_404_NOT_FOUND)