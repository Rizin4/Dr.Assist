from api.models import Report, User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # These are claims, you can add custom claims.
        token['full_name'] = user.profile.full_name
        token['username'] = user.username
        token['email'] = user.email
        token['gender'] = user.profile.gender
        token['verified'] = user.profile.verified
        token['isDoctor'] = user.isDoctor
        # ...
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        data['isDoctor'] = self.user.isDoctor          # Add isDoctor to the response data

        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    isDoctor = serializers.BooleanField(default=False)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2', 'isDoctor')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            isDoctor=validated_data.get('isDoctor', False)
        )

        user.set_password(validated_data['password'])
        user.save()

        return user
    
class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'