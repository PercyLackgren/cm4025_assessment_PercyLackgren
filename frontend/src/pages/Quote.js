import { useOutletContext } from "react-router-dom";
import { useParams } from 'react-router-dom'
import { useState } from 'react';
import SubTask from "./components/SubTask"
import Button from 'react-bootstrap/Button';

import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const AddQuote = () => {
    
    const { id } = useParams()

    // Grab user data if any
    const authenticatedUser = useOutletContext();

    // Hold cost data
    const [data, setData] = useState([
    ]);
    
    // Hold parent quote
    const [quote, setQuote] = useState('');

    let handleQuoteChange = (e) => {
        setQuote({
            user_id: authenticatedUser.user._id,
            description: e.target.value
        })
    }

    // When changes on form happen update the data in state
    let handleCostChange = (index, sub_id, e) => {
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
            quote_id: '',
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
            quote_id: '',
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
        subTask.forEach((cost) => {
            if(Number.isInteger(parseInt(cost.cost))) {
                totalCost += parseInt(cost.cost)
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
        axios.post("http://127.0.0.1:8000/api/quotes", quote).then((response) => {
            // Iterate through data object to parse subtasks
            data.forEach( subtask => {
                // Iterate through subtasks to pull data for database
                subtask.forEach( cost => {
                    // Send data as JSON
                    // set quote_id to newly generated id
                    cost.quote_id = response.data.id
                    axios.post("http://127.0.0.1:8000/api/costs", cost).then((response) => {
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
        axios.get('http://127.0.0.1:8000/api/costs').then((response) => {
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

                <input onChange={handleQuoteChange}></input>

                <br></br>
                <br></br>

                <Button onClick={addSubTask}>Add Sub Task</Button>
                {/* <Button onClick={getItems}>Pull From Database</Button> */}
                <label>Total Cost: £{totalCost}</label>
                {/* Display data */}
                {data.map((cost, index, key) => {
                    return <SubTask 
                    index={index}
                    addEmployee={e => addEmployee(index, e)}
                    addResource={e => addResource(index, e)}
                    handleRemove={handleRemove}
                    handleRemoveItem={handleRemoveItem}
                    handleChange={handleCostChange}
                    subTask={cost}
                    onDelete={e => handleRemove(index, e)}
                    key={key}
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