from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


def _check_role(request, role):
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded_payload = UntypedToken(token).payload

        if 'role' in decoded_payload:
            return decoded_payload['role'] == role

    except (InvalidToken, TokenError, TypeError, KeyError, AttributeError):
        return False

    return False


class IsCandidate(BasePermission):
    def has_permission(self, request, view):
        return _check_role(request, 'candidate')


class IsRecruiter(BasePermission):
    def has_permission(self, request, view):
        return _check_role(request, 'recruiter')


class IsRecruiterAndOwner(IsRecruiter):
    def has_object_permission(self, request, view, obj):
        return (
            super().has_permission(request, view)
            and obj.recruiter == request.user.recruiter
        )


class IsCandidateAndOwner(IsCandidate):
    def has_object_permission(self, request, view, obj):
        return (
            super().has_permission(request, view)
            and obj.candidate == request.user.candidate
        )
