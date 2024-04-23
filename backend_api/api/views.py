import os
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from api.models import User
from api.serializer import (
    MyTokenObtainPairSerializer,
    RegisterSerializer,
    ReportSerializer,
    UserSerializer,
)
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
import PyPDF2
import io
from django.conf import settings
# from .utils import generate_custom_jwt_payload


# import google.generativeai as genai
from django.conf import settings
import re
import ollama
import json
import jwt


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
            refresh_token = request.data.get("refresh_token")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Get All Routes
@api_view(["GET"])
def getRoutes(request):
    routes = ["/api/token/", "/api/register/", "/api/token/refresh/"]
    return Response(routes)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == "GET":
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({"response": data}, status=status.HTTP_200_OK)
    elif request.method == "POST":
        text = "Hello buddy"
        data = (
            f"Congratulation your API just responded to POST request with text: {text}"
        )
        return Response({"response": data}, status=status.HTTP_200_OK)
    return Response({}, status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_doctors(request):
    if request.method == "GET":
        doctors = User.objects.filter(isDoctor=True)
        serializer = UserSerializer(doctors, many=True)
        return Response(serializer.data)
    return Response({}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPatient])
def generate_pdf(request):
    if request.method == "POST":

        # Retrieve chatbot summary

        conversation_data =request.data.get('conversation_data')
        if not conversation_data:
            return Response(
                {"error": "conversation_data is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # load_dotenv()

        # genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        # model = genai.GenerativeModel("gemini-pro")

        # response = model.generate_content(prompt)
        # text = response.text

        prompt_text = "Analyze the provided patient interview data, given in a dictionary format of questions and respective answers. Use this data to fill in the JSON case summary report template below, substituting 'unspecified' if the patient does not provide an answer or value. Maintain the template's structure and ensure the generated JSON is valid."

        jsontemplate = {
            "patient_info": {
                "height": "unspecified",
                "weight": "unspecified",
                "temperature": "unspecified",
                "blood_pressure": "unspecified",
                "glucose_reading": "unspecified",
                "blood_group": "unspecified",
            },
            "allergies": {
                "medication_allergies": "unspecified",
                "food_allergies": "unspecified",
                "other_allergies": "unspecified",
            },
            "current_medications": "unspecified",
            "symptoms": {
                "onset": "unspecified",
                "description": "unspecified",
                "progression": "unspecified",
            },
            "medical_history": {
                "past_illnesses": "unspecified",
                "past_surgeries": "unspecified",
                "family_history": "unspecified",
            },
            "lifestyle": {
                "smoking": "unspecified",
                "alcohol": "unspecified",
                "diet": "unspecified",
                "exercise": "unspecified",
                "sleep_issues": "unspecified",
                "stress": "unspecified",
            },
            "social_determinants": {
                "education_level": "unspecified",
                "job": "unspecified",
                "living_situation": "unspecified",
            },
            "added_info": "unspecified",
        }

        def extract_json(text):
            pattern = r"\{(.|\n)*?\}"

            for match in re.finditer(pattern, text):
                potential_json = match.group(0)

                if potential_json.count("{") > potential_json.count("}"):
                    start_index = match.start()
                    balance = 1
                    end_index = start_index + 1

                    while balance > 0 and end_index < len(text):
                        char = text[end_index]
                        if char == "{":
                            balance += 1
                        elif char == "}":
                            balance -= 1
                        end_index += 1

                    potential_json = text[start_index:end_index]

                try:
                    json.loads(potential_json)
                    return potential_json
                except json.JSONDecodeError:
                    pass

            return None

        prompt = str(conversation_data) + "\n" + prompt_text + "\n" + str(jsontemplate)

        model = ["mistral:latest"]

        response = ollama.chat(
            model=model[0],
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            stream=False,
            keep_alive="5m",
        )
        text = response["message"]["content"]

        extracted_json = extract_json(text.replace("'", '"'))
        chatbot_summary = json.loads(extracted_json)
        print(chatbot_summary)
        # Fetch user details from the authenticated user
        user = request.user
        user_details = {
            "full_name": user.profile.full_name,
            "username": user.username,
            "email": user.email,
            "gender": user.profile.gender,
        }

        # Generate the PDF content
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []

        # Define custom styles
        styles = getSampleStyleSheet()
        custom_title_style = ParagraphStyle(
            name="CustomTitle",
            parent=styles["Title"],
            fontSize=16,
            textColor="navy",
            spaceAfter=12,
        )
        custom_normal_style = ParagraphStyle(
            name="CustomNormal",
            parent=styles["Normal"],
            fontSize=12,
            textColor="black",
            spaceAfter=6,
        )

        # Use custom styles in the PDF generation
        elements.append(Paragraph("Patient Details", custom_title_style))
        elements.append(
            Paragraph(f"Name: {user_details['full_name']}", custom_normal_style)
        )
        elements.append(
            Paragraph(f"Username: {user_details['username']}", custom_normal_style)
        )
        elements.append(
            Paragraph(f"Email: {user_details['email']}", custom_normal_style)
        )
        elements.append(
            Paragraph(f"Gender: {user_details['gender']}", custom_normal_style)
        )

        # Print patient_info before the loop
        patient_info = chatbot_summary.get("patient_info", {})
        for category, info in patient_info.items():
            elements.append(
                Paragraph(
                    f"{category.replace('_', ' ').capitalize()}: {info}",
                    custom_normal_style,
                )
            )

        elements.append(Paragraph("Case Report", custom_title_style))

        # Add sections from chatbot summary
        for section_name, section_data in chatbot_summary.items():
            if (
                section_name != "patient_info"
            ):  # Skip patient_info as it's already printed
                elements.append(
                    Paragraph(section_name.capitalize(), custom_title_style)
                )
                if isinstance(section_data, dict):
                    for field_name, field_value in section_data.items():
                        elements.append(
                            Paragraph(
                                f"{field_name.capitalize()}: {field_value}",
                                custom_normal_style,
                            )
                        )
                else:
                    elements.append(Paragraph(section_data, custom_normal_style))

        doc.build(elements)

        # Convert the file object to Django File object
        pdf_content = buffer.getvalue()
        pdf_file = ContentFile(pdf_content)

        # Save the generated PDF to the database
        pdf_report = Report(user=request.user)
        pdf_report.file.save("report.pdf", pdf_file)
        pdf_report.save()

        # Serialize the saved PDF report
        serializer = ReportSerializer(pdf_report)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def generate_custom_access_token(request):
    user = request.user

    # Generate access token for the user
    # access_token = AccessToken.for_user(user)
    auth_header = request.META.get("HTTP_AUTHORIZATION", "")
    access_token = auth_header.split(" ")[1] if " " in auth_header else auth_header

    # Generate custom payload
    payload ={
        "user": {
            "username": user.username,
            "role": "user",
        },
        "access_token": access_token,
    }

    # Get the secret key
    secret_key = settings.RASA_SECRET_KEY
    print(secret_key)
    access_token = jwt.encode(payload, secret_key, algorithm="HS256")
    # Attach custom payload to access token
    # access_token.payload.update(payload)

    return Response({"access_token": str(access_token)}, status=status.HTTP_200_OK)
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
        serialized_reports = ReportSerializer(received_reports, many=True).data

        # Extract the usernames of all users who shared the PDFs
        shared_usernames = [report.user.username for report in received_reports]

        # Add the usernames to the serialized data
        for report_data, username in zip(serialized_reports, shared_usernames):
            report_data['username'] = username

        return Response(serialized_reports, status=status.HTTP_200_OK)

    
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
    

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsDoctor])
def doctor_append(request, patient_id, report_id):
    doctor_pdf = request.FILES.get('file')
    # Check if patient and patient's PDF exist
    patient_pdf = get_object_or_404(Report, user_id=patient_id, id=report_id)

    # Append doctor's PDF to patient's PDF
    patient_pdf_file = patient_pdf.file.path
    with open(patient_pdf_file, 'rb') as patient_pdf_file:
        pdf_reader = PyPDF2.PdfReader(patient_pdf_file)
        pdf_writer = PyPDF2.PdfWriter()

        # Add patient's PDF pages to new PDF writer
        for page_num in range(len(pdf_reader.pages)):
            pdf_writer.add_page(pdf_reader.pages[page_num])

        # Add doctor's PDF pages to new PDF writer
        pdf_writer.append_pages_from_reader(PyPDF2.PdfReader(doctor_pdf))

        # Construct the path for the new PDF file
        new_pdf_filename = f'{report_id}_combined.pdf'
        new_pdf_path = os.path.join(settings.MEDIA_ROOT, 'modified', new_pdf_filename)

        # Create the 'modified' directory if it doesn't exist
        os.makedirs(os.path.dirname(new_pdf_path), exist_ok=True)

        # Write new PDF to disk
        with open(new_pdf_path, 'wb') as new_pdf_file:
            pdf_writer.write(new_pdf_file)

        # Update patient's PDF in the database
        patient_pdf.file = os.path.join('modified', new_pdf_filename)
        patient_pdf.save()

    return Response({'message': 'PDF uploaded and appended successfully.'}, status=status.HTTP_200_OK)