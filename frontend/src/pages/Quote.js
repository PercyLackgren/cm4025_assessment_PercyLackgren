import { useState } from 'react';
import SubTask from "./components/SubTask"
import Button from 'react-bootstrap/Button';
import axios from 'axios'

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
    let addSubTask = (subTask) => {
        if (!Array.isArray(subTask)) {
            subTask = []
        }
        setData([...data, subTask])
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

    // calculate total cost for display, FUDGELESS
    var totalCost = 0
    data.forEach((subTask) => {
        subTask.forEach((element) => {
            if(Number.isInteger(parseInt(element.cost))) {
                totalCost += parseInt(element.cost)
            }
        })
    })

    // Alert output for data, for testing, submit to API once final
    let handleSubmit = (event) => {
        event.preventDefault();
        // alert(JSON.stringify(data))
        // console.log(data)
        storeItems(data)
    }

    // Store current page to database
    let storeItems = (data) => {
        // e.preventDefault();
        console.log("Storing items")
        console.log(data)
        // First, clear the old list in the database:
        axios.delete("http://127.0.0.1:8000/api/quote", { crossdomain: true }).then ((response) => {
            // Iterate through data object to parse subtasks
            data.forEach( subtask => {
                // Iterate through subtasks to pull data for database
                subtask.forEach( element => {
                    // Send data as JSON
                    axios.post("http://127.0.0.1:8000/api/quote", element).then((response) => {
                        console.log(response.status, response.data);
                    });
                })
            })
        })
    }

    let getItems = (e) => {
        console.log("Getting items")
        e.preventDefault();
        var tasks = "woop"
        axios.get('http://127.0.0.1:8000/api/quote').then((response) => {
            tasks = response.data;
            console.log(tasks)
            addSubTask(tasks)
            });
      }
    
    

    return (
        <div>
            <h1>Add Quote</h1>
            <Button onClick={addSubTask}>Add Sub Task</Button>
            <Button onClick={handleSubmit}>Submit</Button>
            <Button onClick={getItems}>Pull From Database</Button>
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