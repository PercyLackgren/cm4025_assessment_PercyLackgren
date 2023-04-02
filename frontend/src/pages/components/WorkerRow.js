import React from 'react';
import Button from 'react-bootstrap/Button';

function WorkerRow(props) {

    const row = props.row;

    if(row.type === "Employee") {
      return (
      
        <tr>
          <td width={"30%"}>
            <select name='preset_rate' 
              value={row.preset_rate} 
              onChange={props.onChange}
              disabled={props.readOnly}>
                <option value="None">None</option>
                <option value="Junior">Junior</option>
                <option value="Standard">Standard</option>
                <option value="Senior">Senior</option>
              </select>
          </td>
          <td width={"30%"}>
            <select name="cost_type" 
              value={row.cost_type} 
              onChange={props.onChange}
              disabled={props.readOnly}
              // Disable when a preset is selected
              {...row.preset_rate === "None" ? {} : {disabled: true,  value: "preset"}}>
                <option value="None">Select rate type</option>
                <option value="Hourly">Hourly</option>
                <option value="Daily">Daily</option>
                <option hidden value="preset">Preset</option>
              </select>
          </td>
          <td width={"30%"}>
          <input name='cost'
              type="number"
              min="0" 
              value={row.cost}
              placeholder="Enter cost"
              onChange={props.onChange} 
              disabled={props.readOnly}
              // Disable when a preset is selected
              {...row.preset_rate === "None" ? {} : {disabled: true, value: ''}}/>
          </td>
          <td width={"10%"}>
            <Button variant="outline-danger" onClick={props.onDelete} hidden={props.readOnly}>Remove</Button>
          </td>
        </tr>
      );
    }
  }
  
  export default WorkerRow;