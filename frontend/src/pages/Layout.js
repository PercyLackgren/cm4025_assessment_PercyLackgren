import { Outlet, Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

axios.defaults.withCredentials = true

function Layout() {
  
  // Authenticate user in layout, then pass the user to outlet context if any.
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  
  useEffect(() => {
    async function checkAuthentication() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users/profile');
        setAuthenticatedUser(response.data);
        // console.log(response.data);
      } catch (error) {
        // console.log(error.response.data);
      }
    }
    checkAuthentication();
  }, []);

  
  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/">Q</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/quote">Create Quote</Nav.Link>
          </Nav>
          <Button href="/user" variant="outline-primary" className="justify-content-end">Sign in</Button>
        </Container>
      </Navbar>

      <Outlet context={authenticatedUser}/>
    </>
  )
};

export default Layout;