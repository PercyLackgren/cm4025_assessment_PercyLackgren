import { useState } from 'react';
import './App.css';
import Header from "./pages/components/Header"
import EmployeeForm from "./pages/components/EmployeeForm"
import ResourceForm from "./pages/components/ResourceForm"

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