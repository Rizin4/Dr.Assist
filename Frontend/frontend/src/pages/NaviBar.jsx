import { useState  } from "react";
import { Link , useLocation, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './NaviBar.css';
import { jwtDecode } from 'jwt-decode';



const Navibar = () => {


    const navigate = useNavigate();
    const location = useLocation();
    const isAuth = localStorage.getItem("isAuth") === "true";
    // const userName = localStorage.getItem("userName") ;
    const token = localStorage.getItem("access_token");
    const decoded = jwtDecode(token);
    console.log(decoded);
    const userName = decoded.username;
    localStorage.setItem("userName", userName);
    console.log(localStorage.getItem("userName"));
    
  

    const handleLogout = () => {
      localStorage.removeItem("isAuth");
      localStorage.removeItem("userName");
      navigate("/");
    };
  
    const handleSignIn = () => {
      navigate("/");
    };
  
  


  return (
    <Navbar collapseOnSelect expand="lg" className="navbar border-bottom border-body bg-dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" exact className='nav-logo'>MedHUB  .</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          { <Nav className="me-auto">
          {/* <Nav.Link  as={Link} to="/UserHome" className="nav-menu">User Home</Nav.Link>
            <Nav.Link as={Link} to="/TranscribePrototype">Text2speech test</Nav.Link>
            <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
              <NavDropdown.Item as={Link} to="/DocHome">DocHome</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav> } //add some nav links here???
          {location.pathname === "/" || location.pathname === "/Signup" ? (
            <>
            
            <Nav className="nav-button">
                <Nav.Link as={Link} to="/Signup"className="btn">
                 Sign Up   
                </Nav.Link>
                
              <Nav.Link as={Link} to="/" onClick={handleSignIn} className="btn" id="registerBtn">
                Sign In
                </Nav.Link>
            </Nav>
            </>
            ): (
              <>
              <Nav> 
          <NavDropdown title={`Hello ${userName}`} id="basic-nav-dropdown">
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