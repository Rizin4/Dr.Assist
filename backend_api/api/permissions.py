from rest_framework import permissions

class IsNotDoctor(permissions.BasePermission):

    def has_permission(self, request, view):
        # Check if the user is authenticated and Patient
        return request.user.is_authenticated and not request.user.isDoctor
