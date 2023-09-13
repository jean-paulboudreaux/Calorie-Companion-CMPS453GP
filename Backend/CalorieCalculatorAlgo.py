import datetime


class CalorieCalculatorAlgo:
    def calculate_daily_calories(self, height_cm, weight_kg, age, gender, activity_level):
        # Define the Harris-Benedict coefficients
        if gender == 'male':
            bmr_coefficient = 88.362
            weight_coefficient = 13.397
            height_coefficient = 4.799
            age_coefficient = 5.677
        elif gender == 'female':
            bmr_coefficient = 447.593
            weight_coefficient = 9.247
            height_coefficient = 3.098
            age_coefficient = 4.330
        else:
            raise ValueError("Gender must be 'male' or 'female'")

        # Calculate Basal Metabolic Rate (BMR)
        bmr = (weight_coefficient * weight_kg) + (height_coefficient * height_cm) - (
                    age_coefficient * age) + bmr_coefficient

        # Define activity level multipliers
        activity_levels = {
            'sedentary': 1.2,
            'lightly_active': 1.375,
            'moderately_active': 1.55,
            'very_active': 1.725,
            'extremely_active': 1.9
        }

        # Calculate total daily calories based on activity level
        if activity_level in activity_levels:
            total_calories = bmr * activity_levels[activity_level]
            return total_calories
        else:
            raise ValueError("Invalid activity level")

    # Example usage:
    height = 170.5  # in centimeters
    weight = 70.3  # in kilograms
    age = 25
    gender = 'male'
    activity_level = 'moderately_active'

    calories = calculate_daily_calories(height, weight, age, gender, activity_level)
    print(f"Your estimated daily calorie intake is {calories} calories.")

    def estimate_weight_loss_rate(current_weight_kg, goal_weight_kg, daily_calories_deficit):
        # Calculate the daily calorie deficit needed for weight loss
        calories_per_kg = 7700  # Calories per kg of body weight
        calorie_deficit = daily_calories_deficit * 7  # Weekly calorie deficit
        weight_loss_rate = calorie_deficit / calories_per_kg  # Weekly weight loss rate in kg

        # Calculate the estimated time to reach the goal weight
        time_to_goal = (current_weight_kg - goal_weight_kg) / weight_loss_rate  # Weeks

        # Convert weeks to days
        days_to_goal = time_to_goal * 7

        # Calculate the estimated date to reach the goal weight
        today = datetime.date.today()
        estimated_date = today + datetime.timedelta(days=days_to_goal)

        return days_to_goal, estimated_date

    # Example usage:
    height = 170.5  # in centimeters
    current_weight = 70.3  # in kilograms
    goal_weight = 65.0  # in kilograms
    age = 25
    gender = 'male'
    activity_level = 'moderately_active'
    daily_calories_deficit = 500  # Calories per day deficit for weight loss

    calories = calculate_daily_calories(height, current_weight, age, gender, activity_level)
    weight_loss_rate_info = estimate_weight_loss_rate(current_weight, goal_weight, daily_calories_deficit)

    print(f"Your estimated daily calorie intake is {calories} calories.")
    print(f"Based on a daily calorie deficit of {daily_calories_deficit} calories, it will take approximately "
          f"{weight_loss_rate_info[0]} days to reach your goal weight of {goal_weight} kg by {weight_loss_rate_info[1]}.")
