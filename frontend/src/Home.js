import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import MyAccount from "./MyAccount";
import Dashboard from "./Dashboard";

const HomePage = (props) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const[redirect, setRedirect] = useState('')

    useEffect(() => {
        // Read the "username" cookie
        const storedUsername = Cookies.get('username');
        if (storedUsername) {
            // If the cookie is found, set the username state and redirect to "/my-account"
            setUsername(storedUsername);
            navigate('/dashboard');
            setRedirect(<MyAccount username = {username} handleLogin = {props.handleLogin}/>)
        }
        else{
            setRedirect(
                <div>
                    <h1>Welcome to the Home Page</h1>
                    <p>This is a mock home page.</p>
                </div>

            )
        }
    }, [navigate]);


    return (
        <div>
            {redirect}
        </div>
    );
};

export default HomePage;
