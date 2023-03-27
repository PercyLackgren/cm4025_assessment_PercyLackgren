import React, { useState } from "react";
import { Modal, Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import Auth from "./components/Auth";

const SignUpLoginForm = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = e => {
        e.preventDefault();

        const userData = {
            name,
            password
        };
        axios
            .post("http://127.0.0.1:8000/api/auth/register_login", userData, { withCredentials: true })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
                console.log(err.response);
            });
    };

    return (
        <Auth></Auth>
        // <Form onSubmit={onSubmit}>
        //     <Form.Group controlId="formBasicEmail">
        //         <Row>
        //             <Form.Label column xs="2" sm="1">
        //             </Form.Label>
        //             <Col xs="10" sm="11">
        //                 <Form.Control
        //                     type="name"
        //                     placeholder="Enter name"
        //                     onChange={e => {
        //                         setName(e.target.value);
        //                         console.log(name);
        //                     }}
        //                     required
        //                 />
        //                 <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        //                 <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
        //             </Col>
        //         </Row>
        //     </Form.Group>

        //     <Form.Group controlId="formBasicPassword">
        //         <Row>
        //             <Form.Label column xs="2" sm="1">
        //             </Form.Label>
        //             <Col xs="10" sm="11">
        //                 <Form.Control
        //                     type="password"
        //                     placeholder="Password"
        //                     onChange={e => setPassword(e.target.value)}
        //                 />
        //                 <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        //             </Col>
        //         </Row>
        //     </Form.Group>
        //     <Form.Group controlId="formBasicCheckbox">
        //         <Row>
        //             <Col xs="2" sm="1">
        //                 <Form.Check type="checkbox" />
        //             </Col>
        //             <Col xs="10" sm="11">
        //                 <Form.Label>

        //                 </Form.Label>
        //             </Col>
        //         </Row>
        //     </Form.Group>
        //     <button type="submit">Submit</button>
        // </Form>
    );
};

const SignupLoginModal = props => {
    return (
        <SignUpLoginForm />
    );
};

export default SignupLoginModal;