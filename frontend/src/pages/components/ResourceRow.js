import React from 'react';
import Button from 'react-bootstrap/Button';
import * as yup from 'yup';
import { useState, useEffect } from 'react';

function ResourceRow(props) {

    const row = props.row;

    const [errors, setErrors] = useState({});

    const resourceRowSchema = yup.object().shape({
      description: yup.string().required('Description is required'),
      cost_type: yup.string().notOneOf(['None'], 'Please select a cost type').required('Cost type is required'),
      cost: yup.number().typeError('Cost must be a number').required('Cost is required').positive('Cost must be a positive number'),
    });

    const handleValidation = () => {
      resourceRowSchema
      .validate(row, {abortEarly: false})
      .then((validQuote) => {
          // Reset errors
          setErrors({});
      })
      .catch((err) => {
          const errors = {};
          err.inner.forEach((e) => {
              errors[e.path] = e.message;
          });
          setErrors(errors);
      });
    };

    useEffect(() => {
      if (props.trigger) {
        handleValidation();
      }
    }, [props.trigger]);
  
    // Handle changes to the quote section
    let onChange = (e) => {
      props.onChange(e)
      if (props.trigger) {
        handleValidation()
      }
    }


    if(row.type === "Resource") {
      return (    
        <tr>
          <td width={"30%"}>
            <input name='description'
              type="text" 
              value={row.description}
              placeholder="Enter description"
              onChange={onChange} 
              disabled={props.readOnly}
              required
              />
              <br/>
              {errors.description && <span className="error">{errors.description}</span>}
          </td>
          <td width={"30%"}>          
            <select name="cost_type" 
              value={row.cost_type || ''} 
              onChange={onChange}
              disabled={props.readOnly}
              required>
              <option value="None">None</option>
              <option value="otc">One Off</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            <br/>
            {errors.cost_type && <span className="error">{errors.cost_type}</span>}
          </td>
          <td width={"30%"}>
            <input name='cost'
                type="number"
                min="0" 
                value={row.cost || ''}
                placeholder="Enter cost"
                onChange={onChange}
                disabled={props.readOnly} 
                required
                />
                <br/>
                {errors.cost && <span className="error">{errors.cost}</span>}
          </td>
          <td width={"10%"}>
            <Button variant="outline-danger" onClick={props.onDelete} hidden={props.readOnly}>Remove</Button>
          </td>
        </tr>
      );
    }
  }
  
  export default ResourceRow;