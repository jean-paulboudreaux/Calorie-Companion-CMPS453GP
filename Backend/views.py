import json

from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.contrib.sites import requests
from django.core.exceptions import MultipleObjectsReturned
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *
from rest_framework import status, permissions, generics
from rest_framework.decorators import api_view
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.hashers import check_password
from .CalorieCalculatorAlgo import CalorieCalculatorAlgo
import requests

# Create your views here.


@api_view(['POST'])
def login_view(request):
    if request.method == 'POST':
        # Get the username and password from the request data
        username = request.data.get('username')
        password = request.data.get('password')
        print(username)
        print(password)

        # Authenticate the user
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # If authentication is successful, log in the user
            login(request, user)
            return JsonResponse({'message': 'Authentication successful'})
        else:
            # If authentication fails, return an error response
            return JsonResponse({'message': 'Authentication failed'}, status=status.HTTP_401_UNAUTHORIZED)

        # Login the user and set a session cookie


class UpdateUserInfo(generics.UpdateAPIView):
    queryset = UserHealthInfo.objects.all()
    serializer_class = LookupFieldPKUserInfo
    lookup_field = 'user_id'  # Specify the lookup field to match your URL parameter

    def update(self, request, *args, **kwargs):
        user_id = self.kwargs.get("user_id")
        print(user_id)
        user_info = UserHealthInfo.objects.get(user_id=user_id)
        print(user_info.activity_level)
        serializer = self.get_serializer(user_info, data=request.data, partial=True)
        calc_algo = CalorieCalculatorAlgo()

        if serializer.is_valid():
            # Update the fields you want to update
            user_info.height_in_cm = serializer.validated_data.get('height_in_cm', user_info.height_in_cm)
            user_info.weight_in_kg = serializer.validated_data.get('weight_in_kg', user_info.weight_in_kg)
            user_info.goal_weight_in_kg = serializer.validated_data.get('goal_weight_in_kg',
                                                                        user_info.goal_weight_in_kg)
            user_info.age = serializer.validated_data.get('age', user_info.age)
            user_info.activity_level = serializer.validated_data.get('activity_level', user_info.activity_level)
            user_info.gender = serializer.validated_data.get('gender')
            user_info.daily_calories = calc_algo.calculate_daily_calories(height_cm=user_info.height_in_cm,
                                                                          weight_kg=user_info.weight_in_kg,
                                                                          age=user_info.age,
                                                                          gender=user_info.gender,
                                                                          activity_level=user_info.activity_level)
            user_info.estimated_completion_date = calc_algo.estimate_weight_loss_rate(
                current_weight_kg=user_info.weight_in_kg, goal_weight_kg=user_info.goal_weight_in_kg,
                daily_calories_deficit=user_info.daily_calories, )

            # Save the updated instance
            user_info.save()

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        # Retrieve the user_id from the URL parameters
        user_id = self.kwargs.get('user_id')

        # Query the UserHealthInfo model for records associated with the specified user_id
        queryset = UserHealthInfo.objects.filter(user__id=user_id)

        return queryset


class UserView(APIView):
    queryset = CustomUser.objects.all()
    serializer_class = InitializeUser

    def post(self, request):
        # Get username and password from the request data
        username = request.data.get('username', '')  # Default to an empty string if 'username' is not in request.data
        password = request.data.get('password', '')  # Default to an empty string if 'password' is not in request.data
        # Create a user instance
        userAccount = CustomUser(username=username)

        # Use make_password to hash the password
        userAccount.password = make_password(password)

        user_health_initialization = UserHealthInfo(user=userAccount)

        # Save the user
        userAccount.save()
        user_health_initialization.save()
        return Response({"username": username, "password": userAccount.password})


class UserHealthInfoList(APIView):
    queryset = UserHealthInfo.objects.all()
    serializer_class = UserInfo

    def get(self, request, *args, **kwargs):
        # Fetch all CustomUser objects
        global custom_user
        all_custom_users = CustomUser.objects.all()

        # Fetch all UserHealthInfo objects
        all_user_health_info = UserHealthInfo.objects.all()

        # Create a dictionary to store the user_id to id mapping
        user_id_to_id_mapping = {}

        # Iterate through CustomUser objects and store id in the dictionary
        for custom_user in all_custom_users:
            user_id_to_id_mapping[custom_user.id] = custom_user.id

        # Create a list to store the results
        matching_details = []

        # Iterate through UserHealthInfo objects
        for user_health_info in all_user_health_info:
            # Get the corresponding id from the dictionary
            custom_user_id = user_id_to_id_mapping.get(user_health_info.user_id)

            if custom_user_id is not None:
                # If a matching id is found, store the details in the result list
                # Retrieve the username based on the custom_user_id
                custom_user = CustomUser.objects.get(id=custom_user_id)
                matching_details.append({
                    "user_id": user_health_info.user_id,
                    "username": custom_user.username,
                    "gender": user_health_info.gender,
                    "height_in_cm": user_health_info.height_in_cm,
                    "weight_in_kg": user_health_info.weight_in_kg,
                    "goal_weight_in_kg": user_health_info.goal_weight_in_kg,
                    "age": user_health_info.age,
                    "activity_level": user_health_info.activity_level,
                    "daily_calories": user_health_info.daily_calories
                })

        return Response(matching_details, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        # Deserialize the request data
        username = request.data.get('user')
        print(username)

        try:
            # Retrieve the associated CustomUser instance
            custom_user = CustomUser.objects.get(username=username)
            print(custom_user.username)

            # Create a UserHealthInfo instance with the correct user reference
            user_health_info = UserHealthInfo(
                user=custom_user,
                height_in_cm=request.data.get('height_in_cm'),
                weight_in_kg=request.data.get('weight_in_kg'),
                goal_weight_in_kg=request.data.get('goal_weight_in_kg'),
                age=request.data.get('age'),
                activity_level=request.data.get('activity_level'),
            )

            # Save the UserHealthInfo instance
            user_health_info.save()

            # Serialize the created instance and return it in the response
            serializer = UserInfo(user_health_info)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except CustomUser.DoesNotExist:
            # Handle the case when the user with the specified ID does not exist
            return Response({'error': 'CustomUser with the specified ID does not exist.'},
                            status=status.HTTP_404_NOT_FOUND)


class PostUserHealthInfo(APIView):
    queryset = UserHealthInfo.objects.all()
    serializer_class = UserInfo

    def post(self, request, *args, **kwargs):
        # Deserialize the request data
        username = request.data.get('user')
        print(username)

        try:
            # Retrieve the associated CustomUser instance
            custom_user = CustomUser.objects.get(username=username)
            print(custom_user.username)

            # Create a UserHealthInfo instance with the correct user reference
            user_health_info = UserHealthInfo(
                user=custom_user,
                height_in_cm=request.data.get('height_in_cm'),
                weight_in_kg=request.data.get('weight_in_kg'),
                goal_weight_in_kg=request.data.get('goal_weight_in_kg'),
                age=request.data.get('age'),
                activity_level=request.data.get('activity_level'),
                gender=request.data.get('gender')
            )
            # Save the UserHealthInfo instance
            user_health_info.save()

            # Serialize the created instance and return it in the response
            serializer = UserInfo(user_health_info)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except CustomUser.DoesNotExist:
            # Handle the case when the user with the specified ID does not exist
            return Response({'error': 'CustomUser with the specified ID does not exist.'},
                            status=status.HTTP_404_NOT_FOUND)


class FoodItemCreateView(APIView):
    serializer_class = FoodItemSerializer
    queryset = FoodItem.objects.all()

    def post(self, request):
        serializer = FoodItemSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MealCreateView(APIView):
    serializer_class = MealSerializer
    queryset = Meal.objects.all()

    def post(self, request):
        serializer = MealSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


CustomUser = get_user_model()


class UserHealthInfoView(RetrieveAPIView):
    serializer_class = CombinedUserSerializer

    def get_object(self):
        # Retrieve the user by username from the URL parameter
        username = self.kwargs.get('username')
        user, created = CustomUser.objects.get_or_create(username=username)

        # Retrieve the UserHealthInfo associated with the user
        user_health_info, created = UserHealthInfo.objects.get_or_create(user=user.id)
        meals = Meal.objects.filter(date="2023-09-25", user_id=10)
        serialized_meals = MealSerializer(meals, many=True)
        all_meal_instances = serialized_meals.data
        meal_ids = [meal_instance['id'] for meal_instance in all_meal_instances]

        # Now, fetch all FoodItem instances related to the meal_ids
        food_items = FoodItem.objects.filter(meal_id__in=meal_ids)
        food_items_serialized = FoodItemSerializer(food_items, many=True)
        all_food_instances = food_items_serialized.data
        meal_calories = [food_instance['calories'] for food_instance in all_food_instances]
        total_calories = 0
        for num_str in meal_calories:
            try:
                num = float(num_str)
                total_calories += num
            except ValueError:
                # Handle any non-numeric values in the list if needed
                print(f"Skipping non-numeric value: {num_str}")

        print("2023-09-25: ", total_calories)

        # Create a dictionary with user and health info data
        user_data = {
            'user': {  # User data here
                'id': user.id,
                'username': user.username,
                'password': user.password,
                'last_login': user.last_login,
                'is_superuser': user.is_superuser,
                'is_active': user.is_active
            },
            'health_info': {  # Health info data here
                'id': user_health_info.id,
                'user_id': user_health_info.user_id,
                'height_in_cm': user_health_info.height_in_cm,
                'weight_in_kg': user_health_info.weight_in_kg,
                'goal_weight_in_kg': user_health_info.goal_weight_in_kg,
                'age': user_health_info.age,
                'activity_level': user_health_info.activity_level,
                'gender': user_health_info.gender,
                'daily_calories': user_health_info.daily_calories,
                'estimated_completion_date': user_health_info.estimated_completion_date
            }
        }
        return user_data


class GenerateAPIToken(APIView):
    @csrf_exempt
    def get(self, request):
        client_id = '97e0c8f7ca994ec39a2c3dbd383c69de'
        client_secret = '3668a0d94fe74ed5959fced7b6c3cdbc'

        url = 'https://oauth.fatsecret.com/connect/token'
        auth = (client_id, client_secret)
        headers = {'content-type': 'application/x-www-form-urlencoded'}
        data = {
            'grant_type': 'client_credentials',
            'scope': 'basic'
        }

        response = requests.post(url, auth=auth, headers=headers, data=data)

        if response.status_code == 200:
            response_data = response.json()
            return Response(response_data)
        else:
            return Response({'error': 'Failed to obtain token'}, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt  # Add this decorator to allow POST requests from your frontend
def get_food_macros(request):


    if request.method == 'POST':
        # Obtain the access token from FatSecret (assuming you already have code for this)
        access_token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjVGQUQ4RTE5MjMwOURFRUJCNzBCMzU5M0E2MDU3OUFEMUM5NjgzNDkiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJYNjJPR1NNSjN1dTNDeldUcGdWNXJSeVdnMGsifQ.eyJuYmYiOjE2OTU4NDcxNzcsImV4cCI6MTY5NTkzMzU3NywiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjoiYmFzaWMiLCJjbGllbnRfaWQiOiI5N2UwYzhmN2NhOTk0ZWMzOWEyYzNkYmQzODNjNjlkZSIsInNjb3BlIjpbImJhc2ljIl19.LdMhCndYDjTT_Jq-zduhgbvhe15gt9Y8b_6qRvKSvxWPO6KOA0WMw5XSjdZnKWJjnuZaNoYoEujKbYwhY5R9MP8jzT-lXoViAFk4yfUiJRHkAlxnMJHvDsNmMFlus4LTXBL1TDE_oCDwEIuKB84r3nPL3DVAbZAo2FqrPJxmSQdxCq7zekQoOv38EQTzxTSavCc6ZSJPgkzMBxSruUy72xN2OE7EPMHP-YHaTvkw3zvkNPXq8XdVmpa7vB4g834XfVcGO4cPuNcup-6gOQl_jDvyr8yTB-V-sD5NitZCup5ZxArzlFkEt6vL0IxyQxpnFzWxP8Agzf4tuel_Jq4BzA'  # Implement your token retrieval logic here

        if access_token:
            # Get the food item from the request
            data = json.loads(request.body)
            body_data = data.get('body', {})  # Provide an empty dictionary as a default in case 'body' key is missing
            method = body_data.get('method')
            search_expression = body_data.get('search_expression')
            format = body_data.get('format')

            # Prepare the API request to get macros
            api_url = 'https://platform.fatsecret.com/rest/server.api'
            params = {
                'method': 'foods.search',
                'search_expression': search_expression,  # Replace with the appropriate food_id from FatSecret
                'format': 'json',
            }

            headers = {
                'Authorization': f'Bearer {access_token}',
            }

            # Make the API request
            response = requests.get(api_url, params=params, headers=headers)
            if response.status_code == 200:
                data = response.json()
                # Extract and return the macro information from the response
                #macros = data.get('food', {}).get('servings', [])[0].get('nutritional_info', {})
                return JsonResponse(data)
            else:
                return JsonResponse({'error': 'Failed to retrieve food data'}, status=500)

        else:
            return JsonResponse({'error': 'Failed to obtain access token'}, status=500)

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)