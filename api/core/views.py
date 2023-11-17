from rest_framework_simplejwt.views import TokenObtainPairView

from core.serializers import TokenWithRoleSerializer


class TokenWithRoleView(TokenObtainPairView):
    serializer_class = TokenWithRoleSerializer
