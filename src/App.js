import { useState } from 'react';
import './App.css';
import Header from "./components/Header"
import EmployeeForm from "./components/EmployeeForm"
import ResourceForm from "./components/ResourceForm"

function App() {
  return (
    <div>
      <Header></Header>
      <EmployeeForm></EmployeeForm>
      <ResourceForm></ResourceForm>
    </div>
  );
}

export default App;