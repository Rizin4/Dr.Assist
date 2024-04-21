from rest_framework import permissions

class IsPatient(permissions.BasePermission):

    def has_permission(self, request, view):
        # Check if the user is authenticated and Patient
        return request.user.is_authenticated and not request.user.isDoctor

class IsDoctor(permissions.BasePermission):

    def has_permission(self, request, view):
        # Check if the user is authenticated and is a doctor
        return request.user.is_authenticated and request.user.isDoctor