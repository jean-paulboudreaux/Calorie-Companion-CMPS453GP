from rest_framework import serializers
from .models import *
from .models import UserHealthInfo


class InitializeUser(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'password']


class CustomUserModelFields(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'password', 'last_login', 'is_superuser', 'is_active']


class UserInfo(serializers.ModelSerializer):
    class Meta:
        model = UserHealthInfo
        user = InitializeUser()
        lookup_field = 'username'  # Set 'username' as the lookup field

        fields = ['user', 'height_in_cm', 'weight_in_kg', 'goal_weight_in_kg', 'age',
                  'activity_level', 'user_id']


class LookupFieldPKUserInfo(serializers.ModelSerializer):
    class Meta:
        model = UserHealthInfo
        lookup_field = 'user_id'  # Set 'username' as the lookup field

        fields = ['height_in_cm', 'weight_in_kg', 'goal_weight_in_kg', 'age',
                  'activity_level', 'user_id']


class GetAllData(serializers.ModelSerializer):
    user = InitializeUser()  # Nest the InitializeUser serializer inside UserInfo

    class Meta:
        model = UserHealthInfo
        fields = ['user', 'height_in_cm', 'weight_in_kg', 'goal_weight_in_kg', 'age', 'activity_level']


class CustomUserInfo(serializers.ModelSerializer):
    class Meta:
        model = UserHealthInfo
        fields = ['id', 'user_id', 'height_in_cm', 'weight_in_kg', 'goal_weight_in_kg', 'age',
                  'activity_level']


class CustomUserSerializer(serializers.ModelSerializer):
    user = CustomUserModelFields()
    userhealthinfo = CustomUserInfo()  # Embed UserHealthInfoSerializer

    class Meta:
        model = CustomUser
        fields = ('user', 'userhealthinfo')
