import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const DisplayProfile = ({userInfo}) => {
    const currentWeight = parseFloat(userInfo.health_info.weight_in_kg).toFixed(2);
    const goalWeight = parseFloat(userInfo.health_info.goal_weight_in_kg).toFixed(2);
    return (
        <table>
            <tbody>
            <tr>
                <td>Age:</td>
                <td>{userInfo.health_info.age}</td>
            </tr>
            <tr>
                <td>Height:</td>
                <td>{userInfo.health_info.height_in_cm}</td>
            </tr>
            <tr>
                <td>Current Weight:</td>
                <td>{currentWeight} kg</td>
            </tr>
            <tr>
                <td>Goal Weight:</td>
                <td>{goalWeight} kg</td>
            </tr>
            </tbody>
        </table>
    );
};
const MyAccount = (props) => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const username = Cookies.get('username');

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8001/${username}/`);
                setUserInfo(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        if (username) {
            fetchData();
        }
    }, []);

    // Function to handle the logout and redirect to the home page ("/")
    const handleLogout = () => {
        // Clear the "username" cookie (or any other necessary cleanup)
        // You can also perform other logout-related actions here
        Cookies.remove('username');
        props.handleLogin(false);
        // Redirect to the home page
        navigate('/');
    };

    if (loading) {
        return <div>Loading...</div>; // Display a loading indicator
    }

    if (error) {
        return <div>Error: {error.message}</div>; // Display an error message
    }

    return (
        <div>
            <h1>Welcome to your dashboard, {userInfo.user.username}</h1>
            <div>
                <DisplayProfile userInfo={userInfo}></DisplayProfile>
            </div>
        </div>

    );
};

export default MyAccount;
