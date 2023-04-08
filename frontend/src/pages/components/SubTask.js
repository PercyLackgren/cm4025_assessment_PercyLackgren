import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import CostRow from './CostRow';

function SubTask(props) {

  var workerList = []
  var resourceList = []

  workerList = props.subTask.map((row, k) => {
    if (row.type === "Employee") {
      return (
        <CostRow 
          row={row} 
          presetRates={props.presetRates}
          key={k} 
          onChange={e => props.handleChange(k, row.sub_id, e)}
          onDelete={e => props.handleRemoveItem(k, row.sub_id, e)}
          readOnly={props.readOnly}
          trigger={props.trigger}
        ></CostRow>
      )
    } else {
      return null
    }
  });

  resourceList = props.subTask.map((row, k) => {
    if (row.type === "Resource") {
      return (
        <CostRow 
          row={row} 
          key={k} 
          onChange={e => props.handleChange(k, row.sub_id, e)}
          onDelete={e => props.handleRemoveItem(k, row.sub_id, e)}
          readOnly={props.readOnly}
          trigger={props.trigger}
        ></CostRow>
      )
    } else {
      return null
    }
  });

  return (
    <div className='subtask'>
      <div className="container"> 
          <br/>
          <div className="opposite">
            <h2 className="heading--border">Sub Task {props.index + 1}</h2>
            {props.cost ? 
              props.fudgeless ? 
                <h4>Sub Task Cost: £{Math.round(props.cost)}{"("+Math.round(props.fudgeless)+")"}</h4> 
              : <h4>Sub Task Cost: £{Math.round(props.cost)}</h4> 
            : ""}
          </div>
          <br/>
          <div className="opposite">
            <h4>Workers</h4>
            <Button variant="primary" onClick={props.addEmployee} hidden={props.readOnly}>Add Worker</Button>
          </div>
          <table>
              <thead>
                  <tr>
                      <th>Preset</th>
                      <th>Cost Type</th>
                      <th>£ Cost</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                  {workerList}
              </tbody>
          </table>
          <br/>
          <div className="opposite">
            <h4>Resources</h4>
            <Button variant="primary" onClick={props.addResource} hidden={props.readOnly}>Add Resource</Button>
          </div>
          <table>
              <thead>
                  <tr>
                      <th>Description</th>
                      <th>Cost Type</th>
                      <th>£ Cost</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                  {resourceList}
              </tbody>
          </table>
          <br/>
          <div className="center">
            <Button variant="danger" onClick={props.onDelete} hidden={props.readOnly}>Remove SubTask</Button>
          </div>
      </div>
    </div>
  );
}

export default SubTask;