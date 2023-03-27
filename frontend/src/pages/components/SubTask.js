import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import WorkerRow from './WorkerRow';
import ResourceRow from './ResourceRow';

function SubTask(props) {

  // Calcualte subtask cost, parsing text to number looks jank
  var subTaskCost = 0
  props.subTask.map((quote) => {
    if(Number.isInteger(parseInt(quote.cost))) {
      subTaskCost += parseInt(quote.cost)
    }
  })

  var workerList = []
  var resourceList = []

  workerList = props.subTask.map((row, k) => 
    <WorkerRow 
      row={row} 
      key={k} 
      onChange={e => props.handleChange(k, row.sub_id, e)}
      onDelete={e => props.handleRemoveItem(k, row.sub_id, e)}
    ></WorkerRow>
  )
  resourceList = props.subTask.map((row, k) => 
    <ResourceRow 
      row={row} 
      key={k} 
      onChange={e => props.handleChange(k, row.sub_id, e)}
      onDelete={e => props.handleRemoveItem(k, row.sub_id, e)}
    ></ResourceRow>
  )

  return (
    <div className='subtask'>
      <div className="container"> 
          <br/>
          <div class="opposite">
            <h2 className="heading--border">Sub Task {props.index + 1}</h2>
            <h4>Sub Task Cost: £{subTaskCost}</h4>
          </div>
          <br/>
          <div class="opposite">
            <h4>Workers</h4>
            <Button variant="primary" onClick={props.addEmployee}>Add Worker</Button>
          </div>
          <table>
              <thead>
                  <tr>
                      <th>Preset</th>
                      <th>Cost Type</th>
                      <th>Cost</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                  {workerList}
              </tbody>
          </table>
          <br/>
          <div class="opposite">
            <h4>Resources</h4>
            <Button variant="primary" onClick={props.addResource}>Add Resource</Button>
          </div>
          <table>
              <thead>
                  <tr>
                      <th>Description</th>
                      <th>Cost Type</th>
                      <th>Cost</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                  {resourceList}
              </tbody>
          </table>
          <br/>
          <div class="center">
            <Button variant="danger" onClick={props.onDelete}>Remove SubTask</Button>
          </div>
      </div>
    </div>
  );
}

export default SubTask;