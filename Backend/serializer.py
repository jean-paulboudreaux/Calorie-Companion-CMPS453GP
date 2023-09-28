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
                  'activity_level', 'gender', 'daily_calories', 'estimated_completion_date', 'user_id']


class LookupFieldPKUserInfo(serializers.ModelSerializer):
    class Meta:
        model = UserHealthInfo
        lookup_field = 'user_id'  # Set 'username' as the lookup field

        fields = ['height_in_cm', 'weight_in_kg', 'goal_weight_in_kg', 'age',
                  'activity_level', 'gender', 'daily_calories', 'estimated_completion_date', 'user_id']


class CustomUserInfo(serializers.ModelSerializer):
    class Meta:
        model = UserHealthInfo
        fields = ['id', 'user_id', 'height_in_cm', 'weight_in_kg', 'goal_weight_in_kg', 'age',
                  'activity_level', 'daily_calories', 'estimated_completion_date']


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'password', 'last_login', 'is_superuser', 'is_active']


class CustomUserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserHealthInfo
        fields = ['id', 'user_id', 'height_in_cm', 'weight_in_kg', 'goal_weight_in_kg', 'age', 'activity_level', 'gender','daily_calories', 'estimated_completion_date']


class CombinedUserSerializer(serializers.Serializer):
    user = CustomUserSerializer()
    health_info = CustomUserInfoSerializer()  # Embed UserHealthInfoSerializer


class MealSerializer(serializers.ModelSerializer):
    class Meta:
        user = CustomUserModelFields
        model = Meal
        fields = ['id', 'user', 'meal_number', 'date']


class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        meal = MealSerializer()
        model = FoodItem
        fields = ['meal', 'name', 'calories', 'carbohydrates', 'protein', 'sodium', 'fiber', 'sat_fat', 'trans_fat',
                  'total_fat']
