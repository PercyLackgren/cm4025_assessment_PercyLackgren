import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

function ResourceForm(props) {
  return (
    <Form>
      <Row>
        <Form.Label>{props.type}</Form.Label>
        <Col>
          <Form.Label>Cost type</Form.Label>
          <Form.Select name="cost_type" 
          value={props.cost_type} 
          onChange={props.onChange}>
            <option value="None">None</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
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

  );
}

export default ResourceForm;