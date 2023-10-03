// {loggedIn ? <NavLoggedIn/> : <NavLoggedOut/>}
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; // Import your Home component
import Login from './login'; // Import your Login component
import AccountCreationForm from './AccountCreationForm'; // Import your AccountCreationForm component
import MyAccount from './MyAccount';
import Cookies from "js-cookie";
import NavLoggedIn from "./Navigation/NavLoggedIn";
import NavLoggedOut from "./Navigation/NavLoggedOut"; // Import your MyAccount component
import './App.css'
import SideDrawer from "./Navigation/SideDrawer";
import Dashboard from "./Dashboard";
import FoodEntries from "./FoodEntries";
import ExerciseEntries from "./ExerciseEntries";
import Goals from "./Goals";
import Help from "./Help";
import Settings from "./Settings";


function App() {
    const cookie = Cookies.get('username')
    let cookieBool = ''
    cookieBool = !!cookie;
    const [loggedIn, setLoggedIn] = useState(cookieBool);

    const handleLogin = (status) => {
        setLoggedIn(status)
    };

    return (
        <Router>
            <div>
                <div>
                    <h1 className="App-Name">Calorie Companion</h1>
                </div>
                {loggedIn ? <NavLoggedIn handleLogin={handleLogin} /> : <NavLoggedOut handleLogin={handleLogin}/>}

                {loggedIn ? (
                    <div className="app-container">
                        <SideDrawer />
                        <div className='wrapper'>

                    <Routes>
                        <Route path="/" element={<Home handleLogin={handleLogin} loggedIn={loggedIn} />} />
                        <Route path="/login" element={<Login handleLogin={handleLogin} loggedIn={loggedIn} />} />
                        <Route path="/create-account" element={<AccountCreationForm handleLogin={handleLogin} />} />
                        <Route path="/dashboard"
                               element={loggedIn ? <MyAccount handleLogin={handleLogin} /> : <Home handleLogin={handleLogin} loggedIn={loggedIn} />}
                               />
                        <Route path="/food-entries"
                               element={loggedIn ? <FoodEntries handleLogin={handleLogin} /> : <Home handleLogin={handleLogin} loggedIn={loggedIn} />}
                        />
                        <Route path="/exercise-entries"
                               element={loggedIn ? <ExerciseEntries handleLogin={handleLogin} /> : <Home handleLogin={handleLogin} loggedIn={loggedIn} />}
                        />
                        <Route path="/goals"
                               element={loggedIn ? <Goals handleLogin={handleLogin} /> : <Home handleLogin={handleLogin} loggedIn={loggedIn} />}
                        />
                        <Route path="/help"
                               element={loggedIn ? <Help handleLogin={handleLogin} /> : <Home handleLogin={handleLogin} loggedIn={loggedIn} />}
                        />
                        <Route path="/settings"
                               element={loggedIn ? <Settings handleLogin={handleLogin} /> : <Home handleLogin={handleLogin} loggedIn={loggedIn} />}
                        />


                    </Routes>
                        </div>
                    </div>
                ) : (
                    <Routes>
                        <Route path="/" element={<Home handleLogin={handleLogin} loggedIn={loggedIn} />} />
                        <Route path="/login" element={<Login handleLogin={handleLogin} loggedIn={loggedIn} />} />
                        <Route path="/create-account" element={<AccountCreationForm handleLogin={handleLogin} />} />
                        {/* Your routes for when not logged in */}
                    </Routes>
                )}
            </div>
        </Router>
    );
}


export default App;
