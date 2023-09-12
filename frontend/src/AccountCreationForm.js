//      const response = await axios.post('http://127.0.0.1:8000/create-account/', data);
import React, { Component } from 'react';
import axios from 'axios';

class AccountCreationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      isAuthenticated: false,
      height_in_cm: '',
      weight_in_kg: '',
      goal_weight_in_kg: '',
      age: '',
      activity_level: 'Sedentary', // Default value
      successMessage: '',
      errorMessage: '',
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      let username = this.state.username
      let password = this.state.password
      // Send a POST request for authentication
             const response = await axios.post('http://127.0.0.1:8000/create-account/', {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        this.setState({ isAuthenticated: true });
      }
    } catch (error) {
      this.setState({ isAuthenticated: false });
      console.error('Error:', error);    }
  }

  handleDataSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send a POST request to post additional data using the authenticated username
      console.log(this.state)
      const response = await axios.post('http://127.0.0.1:8000/all-users/', {
        user: this.state.username,
        height_in_cm: this.state.height_in_cm,
        weight_in_kg: this.state.weight_in_kg,
        goal_weight_in_kg: this.state.goal_weight_in_kg,
        age: this.state.age,
        activity_level: this.state.activity_level,
      });

      if (response.status === 201) {
        this.setState({
          successMessage: 'Data posted successfully!',
          errorMessage: '',
        });
      }
    } catch (error) {
      this.setState({
        successMessage: '',
        errorMessage: 'Error posting data. Please try again.',
      });
    }
  }

  render() {
    return (
      <div>
        <h2>Authentication and Data Posting</h2>
        {this.state.isAuthenticated ? (
          <div>
            {this.state.successMessage && <p>{this.state.successMessage}</p>}
            {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
            <form onSubmit={this.handleDataSubmit}>
              {/* Add input fields for other attributes (height, weight, goal weight, age, and activity level) */}
              {/* Similar to the login form, include onChange handlers */}
              <div>
                <label>Height (cm):</label>
                <input
                  type="number"
                  name="height_in_cm"
                  value={this.state.height_in_cm}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Weight (lbs):</label>
                <input
                  type="number"
                  name="weight_in_kg"
                  value={this.state.weight_in_kg}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Goal Weight:</label>
                <input
                  type="number"
                  name="goal_weight_in_kg"
                  value={this.state.goal_weight_in_kg}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Age:</label>
                <input
                  type="number"
                  name="age"
                  value={this.state.age}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              {/* Add other input fields for weight, goal weight, age, and activity level here */}
              <button type="submit">Post Data</button>
            </form>
          </div>
        ) : (
          <form method="POST" onSubmit={this.handleLoginSubmit}>
            <div>
              <label>Username:</label>
             <input
             name= "username"
             type="text"
             value={this.state.username}
             onChange={this.handleInputChange}
             required
             />

            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <button type="submit">Authenticate</button>
          </form>
        )}
      </div>
    );
  }
}

export default AccountCreationForm;


