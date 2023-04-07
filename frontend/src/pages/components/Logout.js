import React from 'react';
import axiosInstance from '../../axiosInstance';
import Button from 'react-bootstrap/Button';

function LogoutButton() {
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/users/logout');
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
