import React, { useState } from 'react';
import axiosInstance from '../../axiosInstance';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageClass, setMessageClass] = useState('');

  const userData = {
    username,
    password
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    var params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    try {
      const response = await axiosInstance.post('/users/login', params)
        .then(function (response) {
          // console.log(response);
          window.location.reload(); // Refresh page to update authentication status
        })
        .catch(function (error) {
          // console.log(error);
          setMessageClass("text-danger left-margin")
          setMessage("Incorrect username or password.")
      });
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const handleRegister = async (event) => {
    var params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    try {
      const response = await axiosInstance.post('/users/register', params)
        .then(function (response) {
           console.log(response);
          if (response.data.message === "Successful") {
            setMessageClass("text-success left-margin")
            setMessage("Success, you can now sign in.")
          } else {
            setMessageClass("text-danger left-margin")
            setMessage("Error registering, please try again.")
          }
        })
        .catch(function (error) {
          // console.log(error);
          setMessageClass("text-danger left-margin")
          setMessage("Error registering, please try again")
      });
    } catch (error) {
      console.log(error.response.data);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail" value={username} onChange={(event) => setUsername(event.target.value)}>
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Enter username" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)}/>
      </Form.Group>
      <Button variant="primary" type="submit">Login</Button>
      <Button variant="outline-primary" onClick={handleRegister} className='left-margin'>Register</Button>
      <Form.Text className={messageClass}>
        {message}
      </Form.Text>
    </Form>
  );
}

export default LoginForm;
