import { useState } from 'react';
import EmployeeForm from "./components/EmployeeForm"
import ResourceForm from "./components/ResourceForm"
import SubTask from "./components/SubTask"
import Button from 'react-bootstrap/Button';

const AddQuote = () => {
    
    // Hold data
    const [data, setData] = useState([
    ]);

    // When changes on form happen update the data in state
    let handleChange = (index, sub_id, e) => {
        let newData = [...data];
        newData[sub_id][index][e.target.name] = e.target.value;
        setData(newData);
    }

    // Hard coding some data for testing
    let addSubTask = () => {
        let subTask = []
        setData([...data, subTask])
        console.log(data)
    }


    // Hard coding some data for testing
    let addResource = (i) => {
        let newData = [...data]
        newData[i].push({
            parent_id: 1,
            sub_id: i,
            type: "Resource",
            desc: "",
            cost_type: "",
            cost: ""
        })
        setData(newData)
    }

    // Hard coding some data for testing
    let addEmployee = (i) => {
        let newData = [...data]
        newData[i].push({
            parent_id: 1,
            sub_id: i,
            type: "Employee",
            preset_rate: "None",
            cost_type: "",
            cost: ""
        })
        setData(newData)
    }

    // Remove subtask when clicked
    let handleRemove = (i) => {
        let newData = [...data]
        newData.splice(i,1)
        setData(newData)
    }
    
    // Remove item when clicked
    let handleRemoveItem = (i, sub_id) => {
        let newData = [...data]
        newData[sub_id].splice(i,1)
        setData(newData)
    }

    // Alert output for data, for testing, submit to API once final
    let handleSubmit = (event) => {
        event.preventDefault();
        alert(JSON.stringify(data))
        console.log(data)
    }

    var totalCost = 0
    data.map((subTask) => {
        subTask.map((element) => {
            if(Number.isInteger(parseInt(element.cost))) {
                totalCost += parseInt(element.cost)
            }
        })
    })


    return (
        <div>
            <h1>Add Quote</h1>
            <Button onClick={addSubTask}>Add Sub Task</Button>
            <Button onClick={handleSubmit}>Submit</Button>
            <label>Total Cost: £{totalCost}</label>
            {/* Display data */}
            {data.map((element, index) => {
                return <SubTask 
                addEmployee={e => addEmployee(index, e)}
                addResource={e => addResource(index, e)}
                handleRemove={handleRemove}
                handleRemoveItem={handleRemoveItem}
                handleChange={handleChange}
                subTask={element}
                onDelete={e => handleRemove(index, e)}
                ></SubTask>
            })}
        </div> 
    )
  };
  
  export default AddQuote;