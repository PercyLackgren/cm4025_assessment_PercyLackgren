import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function ResourceRow(props) {

    const row = props.row;

    if (row.type === "Resource") {
      return (    
        <tr>
          <td width={"30%"}>
            <input name='description'
              type="text" 
              value={row.description}
              placeholder="Enter description"
              onChange={props.onChange} 
              disabled={props.readOnly}
              />
          </td>
          <td width={"30%"}>          
            <select name="cost_type" 
              value={row.cost_type || ''} 
              onChange={props.onChange}
              disabled={props.readOnly}>
              <option value="None">None</option>
              <option value="otc">One Off</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select></td>
          <td width={"30%"}>
            <input name='cost'
                type="number"
                min="0" 
                value={row.cost || ''}
                placeholder="Enter cost"
                onChange={props.onChange}
                disabled={props.readOnly} 
                />
          </td>
          <td width={"10%"}>
            <Button variant="outline-danger" onClick={props.onDelete} hidden={props.readOnly}>Remove</Button>
          </td>
        </tr>
      );
    }
  }
  
  export default ResourceRow;