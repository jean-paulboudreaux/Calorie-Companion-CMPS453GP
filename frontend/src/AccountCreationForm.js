//      const response = await axios.post('http://127.0.0.1:8000/create-account/', data);
import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom"; // Import useNavigate
import Cookies from "js-cookie";


function AccountCreationForm(props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    isAuthenticated: false,
    height_in_cm: '',
    weight_in_kg: '',
    goal_weight_in_kg: '',
    age: '',
    activity_level: '',
    gender: '',
    successMessage: '',
    errorMessage: '',
    user_id: '',
    height_in_feet:'',
    height_in_inches: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleActivityLevelChange = (e) => {
    const newActivityLevel = e.target.value;
    setFormData({
      ...formData,
      activity_level: newActivityLevel,
    });
  };
  const handleGenderChange = (e) => {
    const newGender = e.target.value;
    setFormData({
      ...formData,
      gender: newGender,
    });
  };
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const { username, password } = formData;
      console.log('posting username and password...');
      const response = await axios.post('http://127.0.0.1:8001/create-account/', {
        username,
        password,
      });

      if (response.status === 200) {
        console.log('successful posting...');
        const username = formData.username;
        axios
            .get('http://127.0.0.1:8001/' + username + '/')
            .then((response) => {
              console.log('Got user data...');
              setFormData({
                ...formData,
                isAuthenticated: true,
                user_id: response.data.user.id,
              });
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
            });
      }
    } catch (error) {
      setFormData({
        ...formData,
        isAuthenticated: false,
      });
      console.error('Error:', error);
    }
  };

  const handleDataSubmit = async (event) => {
    event.preventDefault();

    try {
      const user_id = formData.user_id;
      const user_id_parsed = parseInt(user_id);
      const url = `http://127.0.0.1:8001/update-user-details/${user_id_parsed}/`;

      console.log('putting data...');
      console.log(formData);


      const response = await axios.put(url, {
        user: formData.username,
        height_in_cm: feetToCm(formData.height_in_feet, formData.height_in_inches),
        weight_in_kg: lbsToKg(formData.weight_in_kg),
        goal_weight_in_kg: lbsToKg(formData.goal_weight_in_kg),
        age: formData.age,
        activity_level: formData.activity_level,
        gender: formData.gender,
      });

      if (response.status === 200) {
        console.log('successfully updated data...');
        props.handleLogin(true)
        Cookies.set('username', formData.username, { expires: 1 }); // Expires in 1 day
        navigate('/dashboard')
      } else {
        // Handle other cases
      }
    } catch (error) {
      setFormData({
        ...formData,
        successMessage: '',
        errorMessage: 'Error posting data. Please try again.',
      });
    }
  };

  function handleFeetChange(e) {
    setFormData({...formData, height_in_feet: e.target.value })
  }

  function handleInchesChange(e) {
    setFormData({...formData, height_in_inches: e.target.value })
  }
  function feetToCm(feet, inches){
    return (feet * 30.48) + ((inches / 12) * 30.48)
  }
  function lbsToKg(lbs){
    return lbs * 0.453592
  }
  return (
        <div>
          <h2>Account Setup</h2>
          {formData.isAuthenticated ? (
              <div>
                <form onSubmit={handleDataSubmit}>
                  <div>
                    <label htmlFor="gender">Gender:</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleGenderChange}
                    >
                      <option value="">Select a gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label>
                      Feet:
                      <input type="number" value={formData.height_in_feet} onChange={handleFeetChange} />
                    </label>
                    <label>
                      Inches:
                      <input type="number" value={formData.height_in_inches} onChange={handleInchesChange} />
                    </label>
                  </div>
                  <div>
                    <label>Weight (lbs):</label>
                    <input
                        type="number"
                        name="weight_in_kg"
                        value={formData.weight_in_kg}
                        onChange={handleInputChange}
                        required
                    />
                  </div>
                  <div>
                    <label>Goal Weight:</label>
                    <input
                        type="number"
                        name="goal_weight_in_kg"
                        value={formData.goal_weight_in_kg}
                        onChange={handleInputChange}
                        required
                    />
                  </div>
                  <div>
                    <label>Age:</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        required
                    />
                  </div>
                  <div>
                    <label htmlFor="activity-level">Activity Level:</label>
                    <select
                        id="activity-level"
                        name="activity-level"
                        value={formData.activity_level}
                        onChange={handleActivityLevelChange}
                    >
                      <option value="">Select an activity level</option>
                      <option value="Sedentary">Sedentary</option>
                      <option value="Lightly Active">Lightly Active</option>
                      <option value="Moderately Active">Moderately Active</option>
                      <option value="Very Active">Very Active</option>
                      <option value="Extremely Active">Extremely Active</option>
                    </select>
                  </div>
                  {/* Add other input fields for weight, goal weight, age, and activity level here */}
                  <button type="submit">Create Account</button>
                </form>
              </div>
          ) : (
              <form method="POST" onSubmit={handleLoginSubmit}>
                <div>
                  <label>Username:</label>
                  <input
                      name= "username"
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                  />
                </div>
                <div>
                  <label>Password:</label>
                  <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                  />
                </div>
                <button type="submit">Next</button>
              </form>
          )}
        </div>


    );
}

export default AccountCreationForm;


