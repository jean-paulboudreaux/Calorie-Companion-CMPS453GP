import datetime
from time import timezone

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class CustomUserManager(BaseUserManager):

    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        username = self.model.normalize_username(username)  # Normalize the username if needed
        user = self.model(username=username, **extra_fields)
        password = user.set_password(password)
        user.save(using=self._db)
        print(user)
        return user.username

    def create_superuser(self, username, password=None, **extra_fields):

        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    # Add other fields as needed
    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'

    # Add REQUIRED_FIELDS if necessary

    def __str__(self):
        return self.username

    def get_user_id_by_username(self, username):
        try:
            user = self.objects.get(username=username)
            return user.id
        except self.DoesNotExist:
            return None


class UserHealthInfo(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)  # Associate the health info with a user

    height_in_cm = models.DecimalField(max_digits=5, decimal_places=2, default=0)  # Height in centimeters (e.g., 170.5)
    weight_in_kg = models.DecimalField(max_digits=9, decimal_places=6, default=0)  # Weight in kilograms (e.g., 70.3)
    goal_weight_in_kg = models.DecimalField(max_digits=9, decimal_places=6, default=0)  # Goal weight in kilograms
    age = models.PositiveIntegerField(default=0)  # Age in years (e.g., 25)

    objects = CustomUser()

    # Choices for activity level
    SEDENTARY = 'Sedentary'
    LIGHTLY_ACTIVE = 'Lightly Active'
    MODERATELY_ACTIVE = 'Moderately Active'
    VERY_ACTIVE = 'Very Active'
    EXTREMELY_ACTIVE = 'Extremely Active'

    ACTIVITY_LEVEL_CHOICES = [
        (SEDENTARY, 'Sedentary'),
        (LIGHTLY_ACTIVE, 'Lightly Active'),
        (MODERATELY_ACTIVE, 'Moderately Active'),
        (VERY_ACTIVE, 'Very Active'),
        (EXTREMELY_ACTIVE, 'Extremely Active'),
    ]

    activity_level = models.CharField(
        max_length=20,
        choices=ACTIVITY_LEVEL_CHOICES,
        default=SEDENTARY,
    )
    DEFAULT = ''
    MALE = 'Male'
    FEMALE = "Female"
    GENDER_CHOICES = [
        (DEFAULT, ''),
        (MALE, 'Male'),
        (FEMALE, 'Female'),
    ]
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default=DEFAULT)
    daily_calories = models.IntegerField(default=0)
    estimated_completion_date = models.DateField(default= datetime.date.today())
    def __str__(self):
        return self.user.username


class Meal(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Associate the meal with a user
    meal_number = models.PositiveIntegerField()  # Meal number (e.g., 1, 2, 3)
    date = models.DateField()  # Date of the meal

    def __str__(self):
        return self.user.username
class FoodItem(models.Model):
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE, default=None)  # You can specify the default value here
    name = models.CharField(max_length=255)  # Name of the food item (e.g., "Apple")
    calories = models.DecimalField(max_digits=6, decimal_places=2)  # Calories per serving
    carbohydrates = models.DecimalField(max_digits=6, decimal_places=2)  # Carbohydrates per serving (in grams)
    protein = models.DecimalField(max_digits=6, decimal_places=2)  # Protein content per serving (in grams)
    sodium = models.DecimalField(max_digits=6, decimal_places=2)
    fiber = models.DecimalField(max_digits=6, decimal_places=2)  # Dietary fiber per serving (in grams)
    sat_fat = models.DecimalField(max_digits=6, decimal_places=2)
    trans_fat = models.DecimalField(max_digits=6, decimal_places=2)
    total_fat = models.DecimalField(max_digits=6, decimal_places=2)

    # Add more fields for additional nutritional information as needed
    def __str__(self):
        return self.meal.user.username
