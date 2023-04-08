
import { useOutletContext } from "react-router-dom";
import React from 'react';
import Login from './components/Login';
import Logout from './components/Logout';
import Dropdowns from "./components/Dropdowns";
import MergeQuotes from "./components/MergeQuotes";

function SignUpLoginForm(props) {

    const authenticatedUser = useOutletContext();

    return (
        <div>
            <div className="container"> 
                <br/>

                <h1 className="heading--border">
                    {/* Style welcome message */}
                    {authenticatedUser ? 
                        "Welcome " + authenticatedUser.user.username 
                    : "Sign In / Register"}
                </h1>
                {/* Show admin panel */}
                {authenticatedUser ? 
                    authenticatedUser.user.admin ? 
                        <Dropdowns/> 
                    : ''
                : ''}
                <br/>

                {/* Show Login/Logout panel */}
                {authenticatedUser ? 
                    <span>
                        <MergeQuotes userId={authenticatedUser.user._id}/>
                        <br/>
                        <Logout />
                    </span>
                : <Login />}
            </div>
        </div>
    );
};

export default SignUpLoginForm;