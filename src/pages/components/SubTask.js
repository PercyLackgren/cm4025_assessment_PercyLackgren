import Button from 'react-bootstrap/Button';
import EmployeeForm from "./EmployeeForm"
import ResourceForm from "./ResourceForm"

function SubTask(props) {
  return (
    <div style={{backgroundColor: "AntiqueWhite", margin:5, padding:5}}>
        <Button onClick={props.addEmployee}>Add Employee</Button>
        <Button onClick={props.addResource}>Add Resource</Button>
        <Button onClick={props.onDelete}>Remove Task</Button>
        <label>Sub Task Cost: </label>
        {props.subTask.map((element, index) => {
                if (element.type === "Resource") {
                    return <ResourceForm 
                        type={element.type} 
                        cost_type={element.cost_type} 
                        cost={element.cost} 
                        onDelete={e => props.handleRemoveItem(index, element.sub_id, e)}
                        onChange={e => props.handleChange(index, element.sub_id, e)}>
                    </ResourceForm>
                } else {
                    return <EmployeeForm 
                      type={element.type} 
                      preset_rate={element.preset_rate}
                      cost_type={element.cost_type}
                      cost={element.cost} 
                      onDelete={e => props.handleRemoveItem(index, element.sub_id, e)}
                      onChange={e => props.handleChange(index, element.sub_id, e)}>
                    </EmployeeForm>
                }
            })}
    </div>
  );
}

export default SubTask;