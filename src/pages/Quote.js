import { useState } from 'react';
import EmployeeForm from "./components/EmployeeForm"
import ResourceForm from "./components/ResourceForm"
import Button from 'react-bootstrap/Button';

const AddQuote = () => {
    // Hard coding some data for testing
    const [Employee, setEmployee] = useState({
        parent_id: 1,
        type: "Employee",
        preset_rate: "None",
        cost_type: "Daily",
        cost: 100
    });
    const [Resource, setResource] = useState({
        parent_id: 1,
        type: "Resource",
        name: "Internet",
        cost_type: "Monthly",
        cost: 100
    });
    const [data, setData] = useState([
        Employee,
        Resource
    ]);

    let handleChange = (i, e) => {
        let newData = [...data];
        newData[i][e.target.name] = e.target.value;
        setData(newData);
    }

    let addResource = () => {
        setData([...data, {
            parent_id: "",
            type: "Resource",
            name: "",
            cost_type: "",
            cost: ""}])
    }

    let addEmployee = () => {
        setData([...data, Employee])
    }

    let removeResource = (i) => {
        let newData = [...data]
        newData.splice(i,1)
        setData(newData)
    }

    let handleSubmit = (event) => {
        event.preventDefault();
        alert(JSON.stringify(data))
        console.log(data)
    }

    return (
        <div>
            <h1>Add Quote</h1>
            {data.map((element, index) => {
                if (element.type == "Resource") {
                    return <ResourceForm 
                        type={element.type} 
                        cost_type={element.cost_type} 
                        cost={element.cost} 
                        onDelete={e => removeResource(index, e)}
                        onChange={e => handleChange(index, e)}>
                    </ResourceForm>
                } else {
                    return <label>Employee</label>
                }
            })}
            <button onClick={addEmployee}>Add Employee</button><button onClick={addResource}>Add Resource</button><button onClick={handleSubmit}>Submit</button>
        </div> 
    )
  };
  
  export default AddQuote;