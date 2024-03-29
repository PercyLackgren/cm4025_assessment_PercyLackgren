import { useOutletContext } from "react-router-dom";
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import SubTask from "./components/SubTask"
import axiosInstance from '../axiosInstance';
import Footer from './components/Footer';

// Form validation
import * as yup from 'yup';

const AddQuote = () => {
    
    // Get the id of existing quote
    const { id } = useParams()

    // store readonly field
    const [readOnly, setReadOnly] = useState(true)

    // Grab user data
    const authenticatedUser = useOutletContext();
    
    // Hold parent quote
    const [quote, setQuote] = useState({
        description: undefined, 
        timespan_type: undefined, 
        timespan: 0, 
        user_id: undefined,
        cost: '',
        username: undefined
    });

    // Yup validation of the quote
    const quoteSchema = yup.object().shape({
        description: yup
            .string()
            .required(),
        timespan_type: yup
            .string()
            .notOneOf(['none'], 'Please select a timespan type')
            .required(),
        timespan: yup
            .number()
            .min(1)
            .typeError('Timespan must be a number')
            .required(),
        // Other fields not user accessible
      });

    // Hold quote validation errors
    const [errors, setErrors] = useState({});

    // Hold cost validation error flags
    const [costErrors, setCostErrors] = useState([])

    // Hold cost data
    const [data, setData] = useState([]);

    // Trigger for cost validation
    const [trigger, setTrigger] = useState(0);

    // Create a list to keep track of costs to delete
    const [deleteList, setDeletelist] = useState([])

    // Hold subtasks costs
    const [subtaskCosts, setSubtaskCosts] = useState([])
    const [fudgelessCosts, setFudgelessCosts] = useState([])

    // Hold dropdown list of rates to pass to WorkerRow
    const [presetRates, setPresetRates] = useState('')

    // Load quote and costs
    if ( id === undefined) {
        // Creating a new quote dont load anything
    } else {
        if (quote.description === undefined) {
            axiosInstance.get("/quotes/" + id).then((response) => {
                setQuote({ ...response.data, username: response.data.user_id.username });

                // calculate total number of days of loaded quote
                var days = 0
                switch (response.data.timespan_type) {
                    case "days": 
                        days = response.data.timespan; 
                        break;
                    case "weeks": 
                        days = response.data.timespan*7; 
                        break;
                    case "months": 
                        days = response.data.timespan*28; 
                        break;
                    default:
                        break;
                }

                axiosInstance.get("/costs/quote/" + id).then((response) => {
                    // console.log(response.data)
                    // setData(response.data)
                    
                    const subArrays = splitArray(response.data.data);
                    setData(subArrays)

                    // Use days to convert resulting monthly cost from db
                    var costData = response.data.costs
                    console.log(response.data.otcs)
                    costData = costData.map(function(element) {
                        return element/28*days;
                    });

                    // Add one time costs outside of calculations
                    var otcs = response.data.otcs
                    otcs.forEach((otc, index) => {
                        costData[index] += otc
                    })
                    
                    // Calculate the total cost
                    const costSum = costData.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue;
                    }, 0);     
                    costData.unshift(costSum)

                    setSubtaskCosts(costData)

                    // get admin fudgelesss
                    var fudgeless = response.data.fudgeless
                    var fudgelessOtcs = response.data.fudgelessOtcs
                    if (fudgeless) {
                        fudgeless = fudgeless.map(function(element) {
                            return element/28*days;
                        });

                        fudgelessOtcs.forEach((otc, index) => {
                            fudgeless[index] += otc
                        })

                        const fudgelessSum = fudgeless.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue;
                        }, 0);     
                        fudgeless.unshift(fudgelessSum)

                        setFudgelessCosts(fudgeless)
                    }
                });
            });
        }
    }

    // Check if user is authorized to edit quote
    useEffect(() => {
        // Check logged in, no login no access
        if (authenticatedUser !== null) {
            // check if new quote
            if (quote.user_id !== undefined) {
                // if not new, check if current user is owner or an admin
                if (authenticatedUser.user._id === quote.user_id._id || authenticatedUser.user.admin) {
                    // console.log("Matching credentials")
                    // allow access
                    setReadOnly(false)
                } 
                // If a user is logged in and creating a new quote 
            } else if (id === undefined) {
                // console.log("New quote")
                // allow access
                setReadOnly(false)
            }
        }
    }, [authenticatedUser, quote, id])

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

    // setup preset rates
    if(!presetRates) {
        axiosInstance.get("/dropdowns/field/preset_rate").then((response) => {
            setPresetRates(response.data)
        })
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
    let handleCostChange = (cost_index, sub_index, e) => {
        let newData = [...data];
        newData[sub_index][cost_index][e.target.name] = e.target.value;
        // Handle dropdown presets, seems like th wrong way to do this but it works
        if(e.target.name === "preset_rate") {
            newData[sub_index][cost_index]["cost"] = presetRates[presetRates.findIndex((option) => option.name === e.target.value)].value
            newData[sub_index][cost_index]["cost_type"] = "Daily"
        }
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
            quote: '',
            sub_id: i,
            type: 'Resource',
            description: '',
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
            quote: '',
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
        let newDeleteList = [...deleteList]
        newData[i].forEach((cost) => {
            if(cost._id !== undefined) {
                newDeleteList.push(cost._id)
            }
            
        })
        setDeletelist(newDeleteList)

        // update state
        newData.splice(i,1)
        setData(newData)
    }

    // Remove item when clicked
    let handleRemoveItem = (i, sub_index) => {
        let newData = [...data]
        // Save _id of cost when removing
        if(newData[sub_index][i]._id !== undefined) {
            setDeletelist([...deleteList, newData[sub_index][i]._id])
        }
        newData[sub_index].splice(i,1)
        setData(newData)
    }

    const handleUpdateChildData = (id, bool) => {
        const updatedCostErrors = { ...costErrors };
        updatedCostErrors[id] = { ...updatedCostErrors[id], errors: bool };
        setCostErrors(updatedCostErrors);
      };

    // Validate data
    let handleSubmit = (event) => {

        setTrigger((trigger) => 1);
        

        // check cost validation errors
        let isValidCosts = true
        for (let key in costErrors) {
            if (costErrors[key].errors) {
                isValidCosts = false
                break;
            }
        }

        quoteSchema
            .validate(quote, {abortEarly: false})
            .then(() => {
                // Reset errors
                setErrors({});
                console.log(isValidCosts)
                if(isValidCosts){
                    storeItems(data, event)
                }
            })
            .catch((err) => {
                const errors = {};
                err.inner.forEach((e) => {
                    errors[e.path] = e.message;
                });
                setErrors(errors);
            });
    }

    // Store current page to database
    let storeItems = (data, event) => {
        console.log("Storing items")
        // console.log(data)

        // Setup the axios fields, by defualt posting a new quote
        var updateUrl = ''
        var method = 'post'

        // Setup updating or deleting
        if (id !== undefined) {
            updateUrl = '/' + id
            if(event.target.name === "remove") {
                method = 'delete'
            } else {
                method = 'put'
            }
        }

        // Create an array of promises to wait for
        let promises = [];

        return axiosInstance({ 
                method: method, 
                url: "/quotes" + updateUrl, 
                data: quote
            }).then((response) => {
            // Iterate through data object to parse subtasks
            data.forEach( subtask => {
                // Iterate through subtasks to pull data for database
                subtask.forEach( cost => {
                    // If deleting quote
                    if(event.target.name === "remove") { 
                        promises.push(axiosInstance.delete("/costs/" + cost._id));
                    } else {
                        // When saving or updating a quote
                        if(cost._id === undefined) {
                            // If new 
                            // console.log(response)
                            // set quote to newly generated id
                            cost.quote = response.data.id
                            promises.push(axiosInstance.post("/costs", cost));
                            
                        } else {
                            // Else update existing
                            promises.push(axiosInstance.put("/costs/" + cost._id, cost));
                        }
                    }
                })
            })
            // If any costs are on the delete list and no longer in the state, remove them from the database
            deleteList.forEach((id) => {
                axiosInstance.delete("/costs/" + id).then((response) => {
                    console.log(response.status, response.data);
                });
            })
            // reset delete list
            setDeletelist([])

            // Wait for all promises to resolve before refreshing the page
            Promise.all(promises).then(() => {
                // Refresh page
                if (response.data.id !== undefined) {
                    window.location.href = ("/quote/" + response.data.id);
                } else {
                    window.location.href = ("/")
                }
            });
        })
    }
    
    // console.log(quote)
    // console.log(data)
    // console.log(deleteList)

    return (
        <div className="container"> 
            <br/>
            <div className="opposite">
                <h1 className="heading--border">{id ? "Edit Quote" : "Create Quote"}</h1>
                {subtaskCosts[0] ? 
                    fudgelessCosts[0] ? 
                      <h4>Total Cost: £{Math.round(subtaskCosts[0])}{"("+Math.round(fudgelessCosts[0])+")"}</h4> 
                    : <h4>Total Cost: £{Math.round(subtaskCosts[0])}</h4> 
                : ""}
            </div>
            {quote.username ? <p>Author: {quote.username}</p> : ''}
            <table>
                <tbody>
                    <tr>
                        <td colSpan={2}>
                        <label>Description</label>
                            <textarea 
                                className="width-100"
                                name="description"
                                placeholder="Quote description"
                                style={{ height: '100px' }}
                                value={quote.description} 
                                onChange={handleQuoteChange}
                                disabled={readOnly}
                            />
                            {errors.description && <span className="error">{errors.description}</span>}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Timespan type</label>
                            <select 
                                className="width-100"
                                name="timespan_type"
                                onChange={handleQuoteChange}
                                value={quote.timespan_type} 
                                disabled={readOnly}>
                                    <option value="none"> Please select a timespan type</option>
                                    <option value="days">Days</option>
                                    <option value="weeks">Weeks</option>
                                    <option value="months">Months</option>
                            </select>
                            {errors.timespan_type && <span className="error">{errors.timespan_type}</span>}
                        </td>
                        <td>
                            <label>Timespan</label>
                            <br></br>
                            <input
                                onChange={handleQuoteChange} 
                                className="width-100"
                                value={quote.timespan} 
                                name="timespan"
                                type="number" 
                                min="1"
                                placeholder="Enter timespan"
                                disabled={readOnly}
                            />
                            {errors.timespan && <span className="error">{errors.timespan}</span>}
                        </td>
                    </tr>
                </tbody>
            </table>

            <br></br>
            <br></br>

            <button onClick={addSubTask} hidden={readOnly}>Add Sub Task</button>
            {/* Display data */}
            {data.map((child, index) => {
                return <SubTask 
                index={index}
                addEmployee={e => addEmployee(index, e)}
                addResource={e => addResource(index, e)}
                handleRemove={handleRemove}
                handleRemoveItem={handleRemoveItem}
                handleCostChange={handleCostChange}
                subTask={child}
                presetRates={presetRates}
                onDelete={e => handleRemove(index, e)}
                readOnly={readOnly}
                key={index}
                trigger={trigger}
                cost={subtaskCosts[index+1]}
                handleUpdateChildData={handleUpdateChildData}
                fudgeless={fudgelessCosts[index+1]}
                ></SubTask>
            })}
            <div className='opposite'>
                <div/>
                <div>
                    {id ? 
                    <button 
                        hidden={readOnly} 
                        name="remove" 
                        onClick={handleSubmit}
                    >Remove Quote</button>
                    : ""}
                    <button 
                        hidden={readOnly} 
                        id="save" 
                        onClick={handleSubmit} 
                        className="left-margin">
                        {id ? "Save Quote" : "Submit Quote"}
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    )
  };
  
  export default AddQuote;