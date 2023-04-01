import { useOutletContext } from "react-router-dom";
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import SubTask from "./components/SubTask"
import axios from 'axios'

// bootstrap
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const AddQuote = () => {
    
    const { id } = useParams()

    // Grab user data if any
    const authenticatedUser = useOutletContext();

    // Hold cost data
    const [data, setData] = useState([]);
    
    // Hold parent quote
    const [quote, setQuote] = useState({
        description: undefined, 
        timespan_type: undefined, 
        timespan: '', 
        user_id: undefined,
        cost: ''
    });

    // Use effect with empty array to only run once
    useEffect(() => {
        // Load quote from ID
        if ( id === undefined) {
            // Creating a new quote dont load anything
        } else {
            if (quote.description === undefined) {
                axios.get("http://127.0.0.1:8000/api/quotes/" + id).then((response) => {
                    setQuote(response.data)
                    axios.get("http://127.0.0.1:8000/api/costs/quote/" + id).then((response) => {
                        // console.log(response.data)
                        // setData(response.data)
                        
                        const subArrays = splitArray(response.data);
                        // console.log(subArrays)
                        setData(subArrays)
                    });
                });
            }
        }
    }, [])

    // function to split arrays from database into separate subtask arrays
    function splitArray(arr) {
        const result = {};
        
        arr.forEach(item => {
            const key = item.sub_id;
            if (!result[key]) {
            result[key] = [];
            }
            result[key].push(item);
        });
        
        return Object.values(result);
    }

    // Handle changes to the quote section
    let handleQuoteChange = (e) => {
        if(authenticatedUser !== null) {
            console.log(authenticatedUser)
            quote.user_id = authenticatedUser.user._id
        }
        const { name, value} = e.target;
        setQuote({ ...quote, [name]: value });
    }

    // When changes on form happen update the state
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
            quote_id: undefined,
            sub_id: i,
            type: 'Resource',
            description: undefined,
            preset_rate: 'None',
            cost_type: undefined,
            cost: ''
        })
        setData(newData)
    }

    // Hard coding some data for testing
    let addEmployee = (i) => {
        let newData = [...data]
        newData[i].push({
            quote_id: undefined,
            sub_id: i,
            type: 'Employee',
            description: undefined,
            preset_rate: 'None',
            cost_type: undefined,
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
        // console.log(data)

        var updateUrl = ''
        var method = 'post'

        console.log(id)

        if (id !== undefined) {
            updateUrl = '/' + id
            method = 'put'
        }
    
        axios({ method: method, 
                url: "http://127.0.0.1:8000/api/quotes" + updateUrl, 
                data: quote}).then((response) => {
            // Iterate through data object to parse subtasks
            data.forEach( subtask => {
                // Iterate through subtasks to pull data for database
                subtask.forEach( cost => {
                    // Send data as JSON
                    // set quote_id to newly generated id
                    // If new 
                    if(cost._id === undefined) {
                        cost.quote_id = response.data.id
                        axios.post("http://127.0.0.1:8000/api/costs", cost).then((response) => {
                            console.log(response.status, response.data);
                        });
                        // Else update existing
                    } else {
                        axios.put("http://127.0.0.1:8000/api/costs/" + cost._id, cost).then((response) => {
                            console.log(response.status, response.data);
                        });
                    }
                })
            })
        })
    }
    
    console.log(quote)
    console.log(data)

    return (
        <div>
            <div className="container"> 
                <br/>
                <h1 className="heading--border">Create Quote</h1>
                <br/>

                <Container>
                    <Row>
                        <Col>
                            <Form.Control
                                as="textarea"
                                name="description"
                                placeholder="Quote description"
                                style={{ height: '100px' }}
                                value={quote.description} 
                                onChange={handleQuoteChange}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Label>Timespan type</Form.Label>
                            <Form.Select 
                                aria-label="Default select example" 
                                name="timespan_type"
                                onChange={handleQuoteChange}
                                value={quote.timespan_type} >
                                    <option value="none"> Please select a timespan type</option>
                                    <option value="days">Days</option>
                                    <option value="weeks">Weeks</option>
                                    <option value="months">Months</option>
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Label>Timespan</Form.Label>
                            <Form.Control 
                                onChange={handleQuoteChange} 
                                value={quote.timespan} 
                                name="timespan"
                                type="number" 
                                min="1"
                                placeholder="Enter timespan"
                            />
                        </Col>
                    </Row>
                </Container>

                <br></br>
                <br></br>

                <Button onClick={addSubTask}>Add Sub Task</Button>
                {/* <Button onClick={getItems}>Pull From Database</Button> */}
                <label>Total Cost: £{totalCost}</label>
                {/* Display data */}
                {data.map((child, index) => {
                    return <SubTask 
                    index={index}
                    addEmployee={e => addEmployee(index, e)}
                    addResource={e => addResource(index, e)}
                    handleRemove={handleRemove}
                    handleRemoveItem={handleRemoveItem}
                    handleChange={handleCostChange}
                    subTask={child}
                    onDelete={e => handleRemove(index, e)}
                    key={index}
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