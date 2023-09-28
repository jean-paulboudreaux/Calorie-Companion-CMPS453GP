import datetime

class CalorieCalculatorAlgo:
    def calculate_daily_calories(self, height_cm, weight_kg, age, gender, activity_level):
        # Define the Harris-Benedict coefficients
        if gender == 'Male':
            bmr_coefficient = 88.362
            weight_coefficient = 13.397
            height_coefficient = 4.799
            age_coefficient = 5.677
        elif gender == 'Female':
            bmr_coefficient = 447.593
            weight_coefficient = 9.247
            height_coefficient = 3.098
            age_coefficient = 4.330
        else:
            raise ValueError("Gender must be 'male' or 'female'")

        # Calculate Basal Metabolic Rate (BMR)
        weight_coefficient = float(weight_coefficient)
        height_coefficient = float(height_coefficient)
        weight_kg = float(weight_kg)
        height_cm = float(height_cm)
        bmr = (weight_coefficient * weight_kg) + (height_coefficient * height_cm) - (
                    age_coefficient * age) + bmr_coefficient
        # Define activity level multipliers
        activity_levels = {
            'Sedentary': 1.2,
            'Lightly Active': 1.375,
            'Moderately Active': 1.55,
            'Very Active': 1.725,
            'Extremely Active': 1.9
        }

        # Calculate total daily calories based on activity level
        if activity_level in activity_levels:
            total_calories = bmr * activity_levels[activity_level]
            return int(total_calories)
        else:
            raise ValueError("Invalid activity level")

    def estimate_weight_loss_rate(self, current_weight_kg, goal_weight_kg, daily_calories_deficit):
        # Calculate the daily calorie deficit needed for weight loss
        calories_per_kg = 7700  # Calories per kg of body weight
        calorie_deficit = daily_calories_deficit * 7  # Weekly calorie deficit
        weight_loss_rate = calorie_deficit / calories_per_kg  # Weekly weight loss rate in kg

        # Calculate the estimated time to reach the goal weight
        time_to_goal = (float(current_weight_kg) - float(goal_weight_kg)) / float(weight_loss_rate)  # Weeks

        # Convert weeks to days
        days_to_goal = time_to_goal * 7

        # Calculate the estimated date to reach the goal weight
        today = datetime.date.today()
        estimated_date = today + datetime.timedelta(days=days_to_goal)

        return estimated_date