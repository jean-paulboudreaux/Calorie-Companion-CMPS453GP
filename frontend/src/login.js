// Login.js
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Container.css'


function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPassword(password)

        try {
            const response = await fetch('http://127.0.0.1:8001/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.status === 200) {
                // Authentication successful, handle the response or redirect
                props.handleLogin(true)
                Cookies.set('username', username, { expires: 1 }); // Expires in 1 day
                navigate('/dashboard')

            } else {
                navigate('/login')
                // Authentication failed, handle the error
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="center">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
}

export default Login;
