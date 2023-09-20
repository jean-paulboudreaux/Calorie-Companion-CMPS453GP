import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import axios, {Axios} from "axios";

const MyAccount = (props) => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        "user": {
            "id": null,
            "username": '',
            "password": '',
            "last_login": null,
            "is_superuser": null,
            "is_active": null
        },
        "userhealthinfo": {
            "id": null,
            "user_id": null,
            "height_in_cm": null,
            "weight_in_kg": null,
            "goal_weight_in_kg": null,
            "age": null,
            "activity_level": null
        }
    })

    useEffect(() => {
        const username = Cookies.get('username')
        try{
            axios.get("http://127.0.0.1:8001/" + username + "/").then(
                (response)=>{
                    setUserInfo(response.data)
            }
            )

        }catch (error){
            console.log("Error: " + error)
        }
    }, []);



    // Function to handle the logout and redirect to the home page ("/")
    const handleLogout = () => {
        // Clear the "username" cookie (or any other necessary cleanup)
        // You can also perform other logout-related actions here
        Cookies.remove('username')
        props.handleLogin(false)
        // Redirect to the home page
        navigate('/');
    };


    return (
        <div>
            <h1>Welcome to your account, {userInfo.user.username}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default MyAccount;
