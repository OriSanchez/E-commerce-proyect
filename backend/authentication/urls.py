from django.urls import path
from django.contrib.auth.views import PasswordResetDoneView, PasswordResetCompleteView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, LoginView, UserProfileView, CreditCardView, CustomPasswordResetConfirmView, UserProfileEditView, CustomPasswordResetView, CustomPasswordResetConfirmView, GetCSRFTokenView

app_name = 'authentication'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/edit/', UserProfileEditView.as_view(), name='profile_edit'), 
    path('credit-card/', CreditCardView.as_view(), name='credit-card'),
    path('password_reset/', CustomPasswordResetView.as_view(), name='password_reset'),
    path('password_reset_confirm/<uidb64>/<token>/', CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password_reset_done/', PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('password_reset_complete/', PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('csrf/', GetCSRFTokenView.as_view(), name='get_csrf_token'),
]
