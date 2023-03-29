
import { useOutletContext } from "react-router-dom";
import Login from "./components/Login"
import Logout from './components/Logout';

function SignUpLoginForm(props) {

    const authenticatedUser = useOutletContext();

    return (
        <div>
            <div className="container"> 
                <br/>
                <h1 className="heading--border">
                    {authenticatedUser ? (
                        "Welcome " + authenticatedUser.user.username 
                    ) : (
                        "Sign In / Register"
                    )}
                </h1>
                <br/>
                {authenticatedUser ? (
                    <Logout />
                    ) : (
                    <Login />
                )}
            </div>
        </div>
    );
};

export default SignUpLoginForm;