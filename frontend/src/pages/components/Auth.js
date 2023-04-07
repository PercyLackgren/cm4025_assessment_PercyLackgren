import React, { useState, useEffect } from 'react';
import Login from "./Login"
import Logout from './Logout';
import axiosInstance from '../../axiosInstance';

function Auth() {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const response = await axiosInstance.get('/users/profile');
        setAuthenticatedUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    }
    checkAuthentication();
  }, []);

  return (
    <div>
      {authenticatedUser ? (
        <Logout />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default Auth;
