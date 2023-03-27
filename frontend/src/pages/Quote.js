import { useState } from 'react';
import SubTask from "./components/SubTask"
import Button from 'react-bootstrap/Button';

import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const CreateQuote = (props) => {
    // Define the state with useState hook
    const navigate = useNavigate();
    const [quote, setQuote] = useState({
        user: '',
        sub_id: '',
        type: '',
        description: '',
        cost_type: '',
        cost: ''
    })
}

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
            user_id: 1,
            sub_id: i,
            type: 'Resource',
            description: '',
            cost_type: '',
            cost: ''
        })
        setData(newData)
    }

    // Hard coding some data for testing
    let addEmployee = (i) => {
        let newData = [...data]
        newData[i].push({
            user_id: 1,
            sub_id: i,
            type: 'Employee',
            preset_rate: 'None',
            cost_type: '',
            cost: ''
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
        subTask.forEach((quote) => {
            if(Number.isInteger(parseInt(quote.cost))) {
                totalCost += parseInt(quote.cost)
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
        axios.delete("http://127.0.0.1:8000/api/quotes", { crossdomain: true }).then((response) => {
            // Iterate through data object to parse subtasks
            data.forEach( subtask => {
                // Iterate through subtasks to pull data for database
                subtask.forEach( quote => {
                    // Send data as JSON
                    axios.post("http://127.0.0.1:8000/api/quotes", quote).then((response) => {
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
        axios.get('http://127.0.0.1:8000/api/quotes').then((response) => {
            tasks = response.data;
            console.log(tasks)
            addSubTask(tasks)
            });
      }
    
    

    return (
        <div>
            <div className="container"> 
                <br/>
                <h1 className="heading--border">Create Quote</h1>
                <br/>
                <Button onClick={addSubTask}>Add Sub Task</Button>
                {/* <Button onClick={getItems}>Pull From Database</Button> */}
                <label>Total Cost: £{totalCost}</label>
                {/* Display data */}
                {data.map((quote, index) => {
                    return <SubTask 
                    index={index}
                    addEmployee={e => addEmployee(index, e)}
                    addResource={e => addResource(index, e)}
                    handleRemove={handleRemove}
                    handleRemoveItem={handleRemoveItem}
                    handleChange={handleChange}
                    subTask={quote}
                    onDelete={e => handleRemove(index, e)}
                    ></SubTask>
                })}
                <div className='opposite'>
                    <div/>
                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </div>
        </div> 
    )
  };
  
  export default AddQuote;