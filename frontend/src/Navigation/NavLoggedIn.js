import React, {useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from "js-cookie";
import { PersonOutline } from 'react-ionicons'
import {useNavigate} from "react-router-dom";

function NavLoggedIn(props){
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the "username" cookie (or any other necessary cleanup)
        // You can also perform other logout-related actions here
        Cookies.remove('username')
        props.handleLogin(false)
        // Redirect to the home page
    };
    return(
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style= { {backgroundColor: "c8b174"}}>
                <a className="navbar-brand" href="/">CalorieCompanion</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav" style={{marginLeft: "80%"}}>
                        <li className="nav-item active">
                            <a className="nav-link" href="/settings"> Settings <span className="sr-only"></span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={handleLogout} href="/">Log out</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default NavLoggedIn