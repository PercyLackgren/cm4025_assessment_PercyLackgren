/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Button from 'react-bootstrap/Button';
import * as yup from 'yup';
import { useState, useEffect } from 'react';

function CostRow(props) {

  const row = props.row;
  const handleUpdateChildData = props.handleUpdateChildData;
  
  const [errors, setErrors] = useState({});

  const workerRowSchema = yup.object().shape({
    preset_rate: yup
      .string()
      .required('preset rate is required'),
    cost_type: yup
      .string()
      .when('preset_rate', {
        is: val => val === 'None',
        then: () => yup
          .string()
          .notOneOf(['None'], 'Please select a cost type')
          .required('Cost type is required'),
      }),
    cost: yup
      .number()
      .when('preset_rate', {
        is: val => val === 'None',
        then: () => yup
          .number()
          .typeError('Cost must be a number')
          .required('Cost is required')
          .positive('Cost must be a positive number'),
      }),
  });

  const resourceRowSchema = yup.object().shape({
    description: yup
      .string()
      .required('Description is required'),
    cost_type: yup
      .string()
      .notOneOf(['None'], 'Please select a cost type')
      .required('Cost type is required'),
    cost: yup
      .number()
      .typeError('Cost must be a number')
      .required('Cost is required')
      .positive('Cost must be a positive number'),
  });

  const handleValidation = () => {
    if(row.type === "Employee") {
      workerRowSchema
      .validate(row, {abortEarly: false})
      .then(() => {
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
    } else {
      resourceRowSchema
      .validate(row, {abortEarly: false})
      .then(() => {
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
    }
  };

  // run validation at start
  useEffect(() => {
    handleValidation()
  }, []);

  // send parent validation errors if any
  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      handleUpdateChildData(row.sub_id, true)
    } else {
      handleUpdateChildData(row.sub_id, false)
    }
  }, [errors, row.sub_id]);

  // Handle changes to the quote section
  let onChange = (e) => {
    props.onChange(e)
    handleValidation()
  }

  // Setup preset rates dropdowns
  let options = []
  if(row.type === "Employee") {
    // Load preset rates into options.
    options = props.presetRates.map((dropdown) => (
      <option 
        key={dropdown._id} 
        value={dropdown.name}>
        {dropdown.name}
      </option>
    )).reverse();
  }

  return (
    <tr>
      {/* Turnary for employee vs resource cost */}
      {row.type === "Employee" ? 
        <td width={"30%"}>
          <select 
            name='preset_rate' 
            value={row.preset_rate} 
            onChange={onChange}
            disabled={props.readOnly}>
              {options}
          </select>
          <br/>
          {props.trigger>0 && <span className="error">{errors.preset_rate}</span>}
        </td>
      : 
        <td width={"30%"}>
          <input 
            name='description'
            type="text" 
            value={row.description}
            placeholder="Enter description"
            onChange={onChange} 
            disabled={props.readOnly}
            required/>
          <br/>
          {props.trigger>0 && <span className="error">{errors.description}</span>}
        </td>
      }
      <td width={"30%"}>
        <select
          name="cost_type" 
          value={row.cost_type} 
          onChange={onChange}
          disabled={props.readOnly}
          // Disable when a preset is selected
          {...row.preset_rate === "None" ? {} : {disabled: true,  value: "Daily"}}>
          {row.type === "Employee" ? 
            <>
              <option value="None">Select rate type</option>
              <option value="Hourly">Hourly</option>
              <option value="Daily">Daily</option>
              <option hidden value="preset">Preset</option>
            </>
            :
            <>
              <option value="None">None</option>
              <option value="otc">One Off</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </>
          }
        </select>
        <br/>
        {props.trigger>0 && <span className="error">{errors.cost_type}</span>}
      </td>
      <td width={"30%"}>
        <input 
          name='cost'
          type="number"
          min="0" 
          placeholder="Enter cost"
          onChange={onChange} 
          disabled={props.readOnly}
          value={row.cost}
          // Disable when a preset is selected, really jank code but it works.
          {...row.preset_rate === "None" ? {} : {disabled: true, value: row.cost}}/>
          <br/>
          {props.trigger>0 && <span className="error">{errors.cost}</span>}
      </td>
      <td width={"10%"}>
        <Button variant="outline-danger" onClick={props.onDelete} hidden={props.readOnly}>Remove</Button>
      </td>
    </tr>
  );
}

export default CostRow;