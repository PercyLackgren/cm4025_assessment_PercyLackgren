
import { useOutletContext } from "react-router-dom";
import Login from './components/Login';
import Logout from './components/Logout';
import Dropdowns from "./components/Dropdowns";

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
                {/* Show admin panel */}
                {authenticatedUser ? (
                    authenticatedUser.user.admin ?  <Dropdowns/> : "no"
                ) : ""}
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