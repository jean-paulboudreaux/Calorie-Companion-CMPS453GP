"""
URL configuration for CalorieCompanion project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import html

from django.contrib import admin
from django.http import HttpResponseNotFound
from django.urls import path

from Backend.views import UserView, UserHealthInfoList, UserHealthInfoView, login_view, PostUserHealthInfo, \
    UpdateUserInfo, FoodItemCreateView, MealCreateView, GenerateAPIToken, get_food_macros

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', login_view, name='login'),
    path('external-api/', GenerateAPIToken.as_view(), name='token'),
    path('create-account/', UserView.as_view(), name="create-account"),
    path('<str:username>/', UserHealthInfoView.as_view(), name='get_user_data'),
    path('post-user-details/', PostUserHealthInfo.as_view(), name="post" ),
    path('update-user-details/<int:user_id>/', UpdateUserInfo.as_view(), name='update'),
    path('all-users/', UserHealthInfoList.as_view(), name="all-users"),
    path('api/search', get_food_macros, name='search-food'),
    path('add-meal/', MealCreateView.as_view()),
    path('add-food/', FoodItemCreateView.as_view()),
]
urlpatterns += [
    path('favicon.ico', lambda request: HttpResponseNotFound()),
]


