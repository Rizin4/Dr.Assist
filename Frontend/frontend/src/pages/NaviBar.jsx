import { useState  } from "react";
import { Link , useLocation, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './NaviBar.css';



const Navibar = () => {


    const navigate = useNavigate();
    const location = useLocation();
    const isAuth = localStorage.getItem("isAuth") === "true";
    const userName = localStorage.getItem("userName") ;
    
  

    const handleLogout = () => {
      localStorage.removeItem("isAuth");
      localStorage.removeItem("userName");
      navigate("/");
    };
  
    const handleSignIn = () => {
      navigate("/");
    };
  
  


  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" exact className='nav-logo'>MedHUB  .</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link  as={Link} to="/UserHome">UserHome</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          {location.pathname === "/" || location.pathname === "/Signup" ? (
            <>
            
            <Nav>
                <Nav.Link as={Link} to="/Signup">
                 Sign Up 
                </Nav.Link>
                
              <Nav.Link as={Link} to="/" onClick={handleSignIn}>
                Sign In
                </Nav.Link>
            </Nav>
            </>
            ): (
              <>
              <Nav> 
          <NavDropdown title="Hello $User" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Edit Profile</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Past Summaries
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                Log Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navibar;