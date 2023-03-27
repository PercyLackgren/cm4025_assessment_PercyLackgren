import { Outlet, Link } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import React, { setState, useEffect } from 'react';

axios.defaults.withCredentials = true

function Layout() {

  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/">Q</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/quote">Create Quote</Nav.Link>
          </Nav>
          <Button href="/signin" variant="outline-primary" className="justify-content-end">Sign in</Button>
        </Container>
      </Navbar>

      <Outlet />
    </>
  )
};

export default Layout;