import Button from 'react-bootstrap/Button';
import EmployeeForm from "./EmployeeForm"
import ResourceForm from "./ResourceForm"

function SubTask(props) {

  // Calcualte subtask cost, parsing text to number looks jank
  var subTaskCost = 0
  props.subTask.map((quote) => {
    if(Number.isInteger(parseInt(quote.cost))) {
      subTaskCost += parseInt(quote.cost)
    }
  })

  return (
    <div style={{backgroundColor: "AntiqueWhite", margin:5, padding:5}}>
        <Button onClick={props.addEmployee}>Add Employee</Button>
        <Button onClick={props.addResource}>Add Resource</Button>
        <Button onClick={props.onDelete}>Remove Task</Button>
        <label>Sub Task Cost: £{subTaskCost}</label>
        {props.subTask.map((quote, index) => {
                if (quote.type === "Resource") {
                    return <ResourceForm 
                      desc={quote.desc}
                      type={quote.type}
                      cost_type={quote.cost_type} 
                      cost={quote.cost} 
                      onDelete={e => props.handleRemoveItem(index, quote.sub_id, e)}
                      onChange={e => props.handleChange(index, quote.sub_id, e)}>
                    </ResourceForm>
                } else {
                    return <EmployeeForm 
                      type={quote.type} 
                      preset_rate={quote.preset_rate}
                      cost_type={quote.cost_type}
                      cost={quote.cost} 
                      onDelete={e => props.handleRemoveItem(index, quote.sub_id, e)}
                      onChange={e => props.handleChange(index, quote.sub_id, e)}>
                    </EmployeeForm>
                }
            })}
    </div>
  );
}

export default SubTask;