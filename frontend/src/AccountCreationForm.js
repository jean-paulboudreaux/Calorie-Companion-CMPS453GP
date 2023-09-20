//      const response = await axios.post('http://127.0.0.1:8000/create-account/', data);
import React, {Component, useState} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { redirect } from 'react-router-dom';
import MyAccount from "./MyAccount";
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
    activity_level: 'Sedentary',
    successMessage: '',
    errorMessage: '',
    user_id: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
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
        height_in_cm: formData.height_in_cm,
        weight_in_kg: formData.weight_in_kg,
        goal_weight_in_kg: formData.goal_weight_in_kg,
        age: formData.age,
        activity_level: formData.activity_level,
      });

      if (response.status === 200) {
        console.log('successfully updated data...');
        props.handleLogin(true)
        Cookies.set('username', response.data.username, { expires: 0.1 }); // Expires in 1 day
        navigate('/my-account')
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
    return (
        <div>
          <h2>Authentication and Data Posting</h2>
          {formData.isAuthenticated ? (
              <div>
                <form onSubmit={handleDataSubmit}>
                  <div>
                    <label>Height (cm):</label>
                    <input
                        type="number"
                        name="height_in_cm"
                        value={formData.height_in_cm}
                        onChange={handleInputChange}
                        required
                    />
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
                  {/* Add other input fields for weight, goal weight, age, and activity level here */}
                  <button type="submit">Post Data</button>
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
                <button type="submit">Authenticate</button>
              </form>
          )}
        </div>


    );
}

export default AccountCreationForm;


