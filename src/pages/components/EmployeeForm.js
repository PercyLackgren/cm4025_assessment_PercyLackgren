import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function App({childToParent}) {
  const [formFields, setFormFields] = useState([
    { employee: '', rate_type: '', rate: '', preset: '' },
  ])

  const [nonHumanResource, setNonHumanResource] = useState([
    { resource: '', rate_type: '', rate: ''},
  ])

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  }

  const submit = (e) => {
    e.preventDefault();
    // console.log(formFields);
    childToParent(formFields)
  }

  const addFields = () => {
    let object = {
      employee: '',
      rate_type: '',
      rate: '',
      preset: ''
    }

    setFormFields([...formFields, object])
  }

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1)
    setFormFields(data)
  }

  return (
    <div className="App">
      <form onSubmit={submit}>
        {formFields.map((form, index) => {
          return (
            
            <Form key={index}>
              <Row>
              <Form.Label>Employee</Form.Label>
                <Col>
                  <Form.Label>Preset</Form.Label>
                  <Form.Select name='preset' value={form.preset} onChange={event => handleFormChange(event, index)}>
                    <option>Select preset</option>
                    <option value="Junior">Junior</option>
                    <option value="Standard">Standard</option>
                    <option value="Senior">Senior</option>
                  </Form.Select>
                </Col>

                <Col>
                  <Form.Label>Rate type</Form.Label>
                  <Form.Select name='rate_type' value={form.rate_type} onChange={event => handleFormChange(event, index)} aria-label="Default select example">
                    <option>Select rate type</option>
                    <option value="Hourly">Hourly</option>
                    <option value="Daily">Daily</option>
                  </Form.Select>
                </Col>

                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Rate</Form.Label>
                    <Form.Control name='rate'
                    type="text" 
                    placeholder="Enter rate" 
                    onChange={event => handleFormChange(event, index)}
                    value={form.rate}
                    />
                  </Form.Group>
                </Col>
                <button onClick={() => removeFields(index)}>Remove</button>
              </Row>

            </Form>
          )
        })}
      </form>
      <Button variant="primary" onClick={addFields}>Add More..</Button>
      <Button variant="primary" onClick={submit}>Submit</Button>
    </div>
  );
}

export default App;