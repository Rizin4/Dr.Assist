import React, { useState } from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    InputGroup,
    FormControl,
    Nav,
    Tab,
} from 'react-bootstrap';

const LoginSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add login/signup logic here
    };

    const [activeTab, setActiveTab] = useState('login');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div>
            <Container className="p-3 my-5 d-flex flex-column w-50">
                <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
                    <Nav variant="pills" className="mb-3 d-flex flex-row justify-content-between">
                        <Nav.Item>
                            <Nav.Link eventKey="login">Login</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="register">Register</Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Tab.Content>
                        <Tab.Pane eventKey="login">
                            <div className="text-center mb-3">
                                <p>Sign in with:</p>

                                <div className="d-flex justify-content-between mx-auto" style={{ width: '40%' }}>
                                    <Button variant="light" className="m-1" style={{ color: '#1266f1' }}>
                                        <i className="fab fa-facebook-f"></i>
                                    </Button>

                                    <Button variant="light" className="m-1" style={{ color: '#1266f1' }}>
                                        <i className="fab fa-twitter"></i>
                                    </Button>

                                    <Button variant="light" className="m-1" style={{ color: '#1266f1' }}>
                                        <i className="fab fa-google"></i>
                                    </Button>

                                    <Button variant="light" className="m-1" style={{ color: '#1266f1' }}>
                                        <i className="fab fa-github"></i>
                                    </Button>
                                </div>

                                <p className="text-center mt-3">or:</p>
                            </div>

                            <Form>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={handleEmailChange} />
                                </Form.Group>

                                <Form.Group controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                                </Form.Group>

                                <Form.Group controlId="formRememberMe" className="d-flex justify-content-between mx-4 mb-4">
                                    <Form.Check type="checkbox" label="Remember me" />
                                    <a href="!#">Forgot password?</a>
                                </Form.Group>

                                <Button variant="primary" type="submit" className="mb-4 w-100" onClick={handleSubmit}>
                                    Sign in
                                </Button>
                                <p className="text-center">
                                    Not a member? <a href="#!">Register</a>
                                </p>
                            </Form>
                        </Tab.Pane>

                        <Tab.Pane eventKey="register">
                            <div className="text-center mb-3">
                                <p>Sign up with:</p>

                                <div className="d-flex justify-content-between mx-auto" style={{ width: '40%' }}>
                                    <Button variant="light" className="m-1" style={{ color: '#1266f1' }}>
                                        <i className="fab fa-facebook-f"></i>
                                    </Button>

                                    <Button variant="light" className="m-1" style={{ color: '#1266f1' }}>
                                        <i className="fab fa-twitter"></i>
                                    </Button>

                                    <Button variant="light" className="m-1" style={{ color: '#1266f1' }}>
                                        <i className="fab fa-google"></i>
                                    </Button>

                                    <Button variant="light" className="m-1" style={{ color: '#1266f1' }}>
                                        <i className="fab fa-github"></i>
                                    </Button>
                                </div>

                                <p className="text-center mt-3">or:</p>
                            </div>

                            <Form>
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter name" />
                                </Form.Group>

                                <Form.Group controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" placeholder="Enter username" />
                                </Form.Group>

                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" />
                                </Form.Group>

                                <Form.Group controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                </Form.Group>

                                <Form.Group controlId="formTerms" className="d-flex justify-content-center mb-4">
                                    <Form.Check type="checkbox" label="I have read and agree to the terms" />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="mb-4 w-100">
                                    Sign up
                                </Button>
                            </Form>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Container>
        </div>
    );
};

  export default LoginSignup;