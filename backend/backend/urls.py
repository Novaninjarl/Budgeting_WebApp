
from django.contrib import admin
from django.urls import path, include
from userApi.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('userApi/register/', CreateUserView.as_view(),name="register"),
    path('userApi/token/', TokenObtainPairView.as_view(), name="get_token"),
    path('userApi/token/refresh/',TokenRefreshView.as_view(),name="refresh"),
    path('userApi-auth/',include("rest_framework.urls")),
    path("finDataApi/",include("finDataApi.urls")),
]    
