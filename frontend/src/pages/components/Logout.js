import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

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
    <Button variant="primary" onClick={handleLogout}>Logout</Button>
  );
}

export default LogoutButton;
