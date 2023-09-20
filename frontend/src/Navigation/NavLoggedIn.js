import React, {useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from "js-cookie";

function NavLoggedIn(props){
    return(
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="/">CalorieCompanion</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link" href="/">Home <span className="sr-only"></span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/">About</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/">Add Meals</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/">Workouts</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default NavLoggedIn