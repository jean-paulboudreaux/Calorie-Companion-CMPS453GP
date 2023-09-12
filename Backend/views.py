from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.shortcuts import render, redirect
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *
from rest_framework import status, permissions, generics
from rest_framework.decorators import api_view
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.hashers import check_password


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

        if serializer.is_valid():
            # Update the fields you want to update
            user_info.height_in_cm = serializer.validated_data.get('height_in_cm', user_info.height_in_cm)
            user_info.weight_in_kg = serializer.validated_data.get('weight_in_kg', user_info.weight_in_kg)
            user_info.goal_weight_in_kg = serializer.validated_data.get('goal_weight_in_kg', user_info.goal_weight_in_kg)
            user_info.age = serializer.validated_data.get('age', user_info.age)
            user_info.activity_level = serializer.validated_data.get('activity_level', user_info.activity_level)

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
                    "height_in_cm": user_health_info.height_in_cm,
                    "weight_in_kg": user_health_info.weight_in_kg,
                    "goal_weight_in_kg": user_health_info.goal_weight_in_kg,
                    "age": user_health_info.age,
                    "activity_level": user_health_info.activity_level
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


class UserHealthInfoAPIView(RetrieveAPIView):
    serializer_class = CustomUserSerializer  # Use the CustomUserSerializer for the response

    def get_object(self):
        username = self.kwargs.get('username')
        try:
            custom_user_instance = CustomUser.objects.get(username=username)
            user_health_info_instance = UserHealthInfo.objects.get(user=custom_user_instance)
            return custom_user_instance, user_health_info_instance
        except CustomUser.DoesNotExist:
            return None
        except UserHealthInfo.DoesNotExist:
            return None

    def retrieve(self, request, *args, **kwargs):
        custom_user_instance, user_health_info_instance = self.get_object()

        if custom_user_instance is None:
            return Response({"error": "Username not found"}, status=status.HTTP_404_NOT_FOUND)
        if user_health_info_instance is None:
            return Response({"error": "User health info not found"}, status=status.HTTP_404_NOT_FOUND)

        custom_user_serializer = CustomUserModelFields(custom_user_instance)
        user_health_info_serializer = CustomUserInfo(user_health_info_instance)

        response_data = {
            'user': custom_user_serializer.data,
            'userhealthinfo': user_health_info_serializer.data,
        }

        return Response(response_data, status=status.HTTP_200_OK)

        #custom_user = CustomUser.objects.get(id=user_health_user.id)
