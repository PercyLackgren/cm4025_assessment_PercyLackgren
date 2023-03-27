import { Outlet, Link } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import React, { setState, useEffect } from 'react';

axios.defaults.withCredentials = true

// axios.interceptors.request.use((config) => {
//   console.log('Request:', config);
//   return config;
// }, (error) => {
//   console.log('Request error:', error);
//   return Promise.reject(error);
// });

// axios.interceptors.response.use((response) => {
//   console.log('Response:', response);
//   return response;
// }, (error) => {
//   console.log('Response error:', error);
//   return Promise.reject(error);
// });

function Layout() {

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/users/profile').then(response => {
      console.log('Get user response: ')
      console.log(response.data)
      if (response.data.user) {
        console.log('Get User: There is a user saved in the server session: ')

        this.setState({
          loggedIn: true,
          username: response.data.user.username
        })
      } else {
        console.log('Get user: no user');
        this.setState({
          loggedIn: false,
          username: null
        })
      }
    })
  }, []);

  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/">Q</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/quote">Quote</Nav.Link>
            <Nav.Link href="/blogs">blogs</Nav.Link>
            <Nav.Link href="/contact">Contact</Nav.Link>
          </Nav>
          <Button href="/signin" variant="outline-primary" className="justify-content-end">Sign in</Button>
        </Container>
      </Navbar>

      <Outlet />
    </>
  )
};

export default Layout;