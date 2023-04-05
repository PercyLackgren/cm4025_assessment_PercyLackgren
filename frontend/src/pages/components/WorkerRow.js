import React from 'react';
import Button from 'react-bootstrap/Button';
import * as yup from 'yup';
import { useState, useEffect } from 'react';

function WorkerRow(props) {

    const row = props.row;

    const [errors, setErrors] = useState({});

    const resourceRowSchema = yup.object().shape({
      preset_rate: yup.string().required('preset rate is required'),
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

    // Load preset rates into options.
    const options = props.presetRates.map((dropdown) => (
      <option key={dropdown._id} value={dropdown.value}>
        {dropdown.name}
      </option>
    )).reverse();

    if(row.type === "Employee") {
      return (
      
        <tr>
          <td width={"30%"}>
            <select name='preset_rate' 
              value={row.preset_rate} 
              onChange={onChange}
              disabled={props.readOnly}>
                {options}
            </select>
            <br/>
            {errors.preset_rate && <span className="error">{errors.preset_rate}</span>}
          </td>
          <td width={"30%"}>
            <select name="cost_type" 
              value={row.cost_type} 
              onChange={onChange}
              disabled={props.readOnly}
              // Disable when a preset is selected
              {...row.preset_rate === "None" ? {} : {disabled: true,  value: "Daily"}}>
                <option value="None">Select rate type</option>
                <option value="Hourly">Hourly</option>
                <option value="Daily">Daily</option>
                <option hidden value="preset">Preset</option>
            </select>
            <br/>
            {errors.cost_type && <span className="error">{errors.cost_type}</span>}
          </td>
          <td width={"30%"}>
            <input name='cost'
                type="number"
                min="0" 
                value={row.cost}
                placeholder="Enter cost"
                onChange={onChange} 
                disabled={props.readOnly}
                // Disable when a preset is selected
                {...row.preset_rate === "None" ? {} : {disabled: true, value: row.preset_rate}}/>
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
  
  export default WorkerRow;