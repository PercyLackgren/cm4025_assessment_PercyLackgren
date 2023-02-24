import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

function EmployeeForm(props) {
  return (
    <Form>
      <Row>
        <Form.Label>{props.type}</Form.Label>
        <Col>
          <Form.Label>Preset</Form.Label>
          <Form.Select name='preset_rate' 
          value={props.preset_rate} 
          onChange={props.onChange}>
            <option value="None">None</option>
            <option value="Junior">Junior</option>
            <option value="Standard">Standard</option>
            <option value="Senior">Senior</option>
          </Form.Select>
        </Col>

        <Col>
          <Form.Label>Cost type</Form.Label>
          <Form.Select name="cost_type" 
          value={props.cost_type} 
          onChange={props.onChange}>
            <option value="None">Select rate type</option>
            <option value="Hourly">Hourly</option>
            <option value="Daily">Daily</option>
          </Form.Select>
        </Col>

        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Cost</Form.Label>
            <Form.Control name='cost'
            type="number" 
            value={props.cost}
            placeholder="Enter cost"
            onChange={props.onChange} 
            />
          </Form.Group>
        </Col>
        <Col>
            <br/>
            <Button onClick={props.onDelete}>Remove</Button>
        </Col>
      </Row>
    </Form>
  )
}

export default EmployeeForm;