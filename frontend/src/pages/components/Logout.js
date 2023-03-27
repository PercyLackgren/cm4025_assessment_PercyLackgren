import React from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true

function LogoutButton() {
  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/users/logout');
      window.location.reload(); // Refresh page to update authentication status
    } catch (error) {
      console.log(error.response.data);
    }
  }

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default LogoutButton;
