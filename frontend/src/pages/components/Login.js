import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const userData = {
    username,
    password
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    var params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('email', 'email@test.com');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/login', params)
        .then(function (response) {
            console.log(response);
            window.location.reload(); // Refresh page to update authentication status
        })
        .catch(function (error) {
            console.log(error);
      });
    } catch (error) {
      console.log(error.response.data);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
