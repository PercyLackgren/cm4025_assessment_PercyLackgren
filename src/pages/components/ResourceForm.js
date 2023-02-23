import { useState } from 'react';

function ResourceForm(props) {
  return (
    <div>
      <input name="type" value={props.type} onChange={props.onChange}></input>
      <input name="cost_type" value={props.cost_type} onChange={props.onChange}></input>
      <input name="cost" value={props.cost} onChange={props.onChange}></input>
      <button onClick={props.onDelete}>-</button>
    </div>
  );
}

export default ResourceForm;