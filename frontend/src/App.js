// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; // Import your Home component
import Login from './login'; // Import your Login component
import AccountCreationForm from './AccountCreationForm'; // Import your AccountCreationForm component
import MyAccount from './MyAccount';
import Cookies from "js-cookie";
import NavLoggedIn from "./Navigation/NavLoggedIn";
import NavLoggedOut from "./Navigation/NavLoggedOut"; // Import your MyAccount component


function App() {
    const cookie = Cookies.get('username')
    let cookieBool = ''
    cookieBool = !!cookie;
    const [loggedIn, setLoggedIn] = useState(cookieBool);

    const handleLogin = (status) => {
        setLoggedIn(status)
    };
    console.log(loggedIn)

    return (
        <Router>
            <div>
                {loggedIn ? <NavLoggedIn/> : <NavLoggedOut/>}
                <Routes>
                    <Route path="/" element={<Home handleLogin={handleLogin} loggedIn={loggedIn} />} />
                    <Route path="/login" element={<Login handleLogin={handleLogin} loggedIn={loggedIn} />} />
                    <Route path="/create-account" element={<AccountCreationForm handleLogin={handleLogin} />} />
                    <Route
                        path="/my-account"
                        element={loggedIn ? <MyAccount handleLogin={handleLogin} /> : <Home handleLogin={handleLogin} loggedIn={loggedIn} />}
                    />
                </Routes>
            </div>

        </Router>
    );
}

export default App;
