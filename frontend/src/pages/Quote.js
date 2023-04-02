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

    const [readOnly, setReadOnly] = useState(false)

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
        cost: '',
        username: undefined
    });

    // Create a list to keep track of costs to delete
    const [deleteList, setDeletelist] = useState([])

    // Load quote and costs
    if ( id === undefined) {
        // Creating a new quote dont load anything
    } else {
        if (quote.description === undefined) {
            axios.get("http://127.0.0.1:8000/api/quotes/" + id).then((response) => {
                setQuote({ ...response.data, username: response.data.user_id.username });
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

    // // Use effect with empty array to only run once
    // useEffect(() => {
    //     checkAuthentication()
    // }, [])

    // async function checkAuthentication() {
    //     try {
    //         const response = await axios.get('http://127.0.0.1:8000/api/users/profile');
    //         // setAuthenticatedUser(response.data);
    //         console.log("Response: " + response.data.user._id);
    //         // console.log("Quote: " + quote.timespan);
    //         if (response.data.user !== undefined) {
    //             console.log("Getting here?")
    //             // console.log(response.data)
    //             // If user is owner or admin set readonly to false
    //             if (response.data.user._id === quote.user_id._id || response.data.user.admin) {
    //                 console.log("Matching credentials")
    //                 setReadOnly(false)
    //             }  
    //             if (id === undefined) {
    //                 console.log("New quote")
    //                 setReadOnly(false)
    //             }
    //         // If new
    //         }  

    //     } catch (error) {
    //         // console.log(error.response.data);
    //     }
    // }

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
            // console.log(authenticatedUser)
            quote.user_id = authenticatedUser.user._id
        }
        const { name, value} = e.target;
        setQuote({ ...quote, [name]: value });
        // console.log(quote)
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
            quote: undefined,
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
            quote: undefined,
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
        
        // Save the _ids of all subtask costs when removing to delete from database.
        if (newData[i][1] !== undefined) {
            let newDeleteList = [...deleteList]
            newData[i].forEach((cost) => {
                newDeleteList.push(cost._id)
            })
            setDeletelist(newDeleteList)
        }
        newData.splice(i,1)
        setData(newData)
    }
    
    // Remove item when clicked
    let handleRemoveItem = (i, sub_id) => {
        let newData = [...data]
        // Save _id of cost when removing
        if(newData[sub_id][i]._id !== undefined) {
            setDeletelist([...deleteList, newData[sub_id][i]._id])
        }
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
        storeItems(data, event)
    }

    // Store current page to database
    let storeItems = (data, event) => {
        console.log("Storing items")
        console.log(data)

        var updateUrl = ''
        var method = 'post'

        if (id !== undefined) {
            updateUrl = '/' + id
            if(event.target.name === "remove") {
                method = 'delete'
            } else {
                method = 'put'
            }
        }
    
        axios({ method: method, 
                url: "http://127.0.0.1:8000/api/quotes" + updateUrl, 
                data: quote}).then((response) => {
            // Iterate through data object to parse subtasks
            data.forEach( subtask => {
                // Iterate through subtasks to pull data for database
                subtask.forEach( cost => {
                    // If deleting quote
                    if(event.target.name === "remove") { 
                        axios.delete("http://127.0.0.1:8000/api/costs/" + cost._id).then((response) => {
                            console.log(response.msg, response.data);
                        });
                    } else {
                        // When saving or updating a quote
                        if(cost._id === undefined) {
                            // If new 
                            // console.log(response)
                            // set quote to newly generated id
                            cost.quote = response.data.id
                            axios.post("http://127.0.0.1:8000/api/costs", cost).then((response) => {
                                console.log(response.msg, response.data);
                            });
                            
                        } else {
                            // Else update existing
                            axios.put("http://127.0.0.1:8000/api/costs/" + cost._id, cost).then((response) => {
                                console.log(response.msg, response.data);
                            });
                        }
                    }
                })
            })
        })

        // If any costs are on the delete list and no longer in the state, remove them from the database
        deleteList.forEach((id) => {
            axios.delete("http://127.0.0.1:8000/api/costs/" + id).then((response) => {
                console.log(response.status, response.data);
            });
        })
        setDeletelist([])
    }
    
    // console.log(quote)
    // console.log(data)
    // console.log(deleteList)

    return (
        <div>
            <div className="container"> 
                <br/>
                <h1 className="heading--border">{id ? "Edit Quote" : "Create Quote"}</h1>
                <p>Author: {quote.username}</p>

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
                                disabled={readOnly}
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
                                value={quote.timespan_type} 
                                disabled={readOnly}>
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
                                disabled={readOnly}
                            />
                        </Col>
                    </Row>
                </Container>

                <br></br>
                <br></br>

                <Button onClick={addSubTask} hidden={readOnly}>Add Sub Task</Button>
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
                    readOnly={readOnly}
                    key={index}
                    ></SubTask>
                })}
                <div className='opposite'>
                    <div/>
                    <div>
                    {id ? <Button hidden={readOnly} name="remove" variant="danger" onClick={handleSubmit}>Remove Quote</Button>: ""}
                    <Button hidden={readOnly} id="save" onClick={handleSubmit} className="left-margin">{id ? "Save Quote" : "Submit Quote"}</Button>
                    </div>
                </div>
            </div>
        </div> 
    )
  };
  
  export default AddQuote;