from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import CustomUser, CreditCard
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer, CreditCardSerializer, LoginSerializer, UserProfileSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.shortcuts import get_object_or_404
from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from store.models import Cart
from rest_framework.permissions import AllowAny
from django.urls import reverse_lazy


class RegisterView(APIView):
    def post(self, request):
        print("Datos recibidos:", request.data)
        serializer = RegisterSerializer(data=request.data)
        queryset = CustomUser.objects.all()
        print("Es valido el serializador?", serializer.is_valid())
        if serializer.is_valid():

            user = serializer.save()  

            cart = Cart.objects.create(user=user)

            return Response({"message": "Usuario registrado exitosamente"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })

        return Response(serializer.errors, status=400)

class GetCSRFTokenView(APIView):
    permission_classes = [AllowAny]  

    def get(self, request):
        return JsonResponse({'csrfToken': get_token(request)})


class CustomPasswordResetView(APIView):
    permission_classes = [AllowAny]
    email_template_name = 'authentication/password_reset_email.html'
    template_name = 'authentication/password_reset.html'
    success_url = reverse_lazy('authentication:password_reset_done')

    permission_classes = []

    @method_decorator(csrf_exempt)
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')  

        if not email:
            return Response({'error': 'El campo de correo electrónico es requerido.'}, status=status.HTTP_400_BAD_REQUEST)

        users = CustomUser.objects.filter(email=email)

        if not users.exists():
            return Response({'error': 'No se encontró un usuario con ese correo electrónico.'}, status=status.HTTP_400_BAD_REQUEST)

        # Si hay múltiples usuarios, puedes manejarlo de varias maneras:
        if users.count() > 1:
            return Response({'error': 'Se encontraron múltiples usuarios con ese correo electrónico. Por favor, contacte al soporte.'}, status=status.HTTP_400_BAD_REQUEST)

        user = users.first()  # Obtener el primer usuario (siempre que solo haya un único usuario)

        # Generar el uid y el token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        url = request.build_absolute_uri(reverse('authentication:password_reset_confirm', kwargs={'uidb64': uid, 'token': token}))

        # Enviar el correo
        send_mail(
            subject='Recuperación de contraseña',
            message=f'Para restablecer su contraseña, haga clic en el siguiente enlace: {url}',
            from_email='noreply@example.com',  # Cambia por tu dirección de correo
            recipient_list=[user.email],
        )

        return Response({'message': 'Se ha enviado un enlace de recuperación de contraseña a su correo electrónico.'}, status=status.HTTP_200_OK)


class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    template_name = 'authentification/password_reset_confirm.html'
    success_url = reverse_lazy('authentification:password_reset_complete')

    def form_valid(self, form):
        form.save()  # Restablecer la contraseña
        messages.success(self.request, "¡Su contraseña ha sido restablecida con éxito!")
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "Ha ocurrido un error al restablecer la contraseña.")
        return super().form_invalid(form)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreditCardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            card = request.user.credit_card
            serializer = CreditCardSerializer(card)
            return Response(serializer.data)
        except CreditCard.DoesNotExist:
            return Response({'message': 'No credit card found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        serializer = CreditCardSerializer(data=request.data)
        if serializer.is_valid():
            card = serializer.save(user=request.user)
            return Response(CreditCardSerializer(card).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileEditView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Devuelve el perfil del usuario autenticado
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        # Actualiza el perfil del usuario autenticado
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)  # partial=True permite actualizar solo los campos enviados
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateStaffUserView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_staff = True  # Marcar como staff
            user.save()
            return Response({"message": "Usuario staff creado exitosamente"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)