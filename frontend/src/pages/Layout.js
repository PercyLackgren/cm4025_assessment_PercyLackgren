import { Outlet, Link } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

const Layout = () => {
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
          <Button variant="outline-primary" className="justify-content-end">Sign in</Button>
        </Container>
      </Navbar>

      <Outlet />
    </>
  )
};

export default Layout;