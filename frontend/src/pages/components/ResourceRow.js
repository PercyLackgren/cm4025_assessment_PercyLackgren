import React from 'react';
import Button from 'react-bootstrap/Button';

function ResourceRow(props) {

    const row = props.row;

    if (row.type === "Resource") {
      return (    
        <tr>
          <td width={"30%"}>
            <input name='desc'
              type="text" 
              value={row.desc}
              placeholder="Enter description"
              onChange={props.onChange} 
              />
          </td>
          <td width={"30%"}>          
            <select name="cost_type" 
              value={row.cost_type} 
              onChange={props.onChange}>
              <option value="None">None</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select></td>
          <td width={"30%"}>
            <input name='cost'
                type="number" 
                value={row.cost}
                placeholder="Enter cost"
                onChange={props.onChange} 
                />
          </td>
          <td width={"10%"}>
            <Button variant="outline-danger" onClick={props.onDelete}>Remove</Button>
          </td>
        </tr>
      );
    }
  }
  
  export default ResourceRow;