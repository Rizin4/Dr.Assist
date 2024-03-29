import React from "react";
import { Link } from "react-router-dom";
import './LoginSignup.css';
import 'boxicons';

const NavBar = () => {
    return (
        <div>
        <div className="wrapper">{/* <!----------------------------- check wrapper -----------------------------------> */}
    <nav className="nav">
        <div className="nav-logo">
            <p>MedHUB .</p>
        </div>
        <div className="nav-menu" id="navMenu">
            <ul>
                <li><Link to="/" exact className="link">Home</Link></li>
                <li><Link to="/UserInfo" className="link">User</Link></li>
                <li><Link to="/DoctorInfo" class="link">Doctor</Link></li>
                <li><Link to="#" class="link">Chat</Link></li>
            </ul>
        </div>
        <div class="nav-button">
            <button class="btn white-btn" id="loginBtn" onClick={login}>Sign In</button>
                <button class="btn" id="registerBtn" onClick={register}>Sign Up</button>
        </div>
        <div class="nav-menu-btn">
            <box-icon className="bx bx-menu" onClick={myMenuFunction}></box-icon> 
        </div>
    </nav>
    </div>
    <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></script>
         <div className="wrapper">

{/* <!----------------------------- Form box ----------------------------------->     */}
    <div class="form-box">
        {/* <!------------------- login form --------------------------> */}

        <div class="login-container" id="login">
            <div class="top">
                <span>Don't have an account? <a href="#" onClick={register}>Sign Up</a></span>
                <header>Login</header>
            </div>
            
            <div class="input-box">
                <input type="text" class="input-field" placeholder="Username or Email"/>
                <box-icon class="bx bx-user"></box-icon >
            </div>
            <div class="input-box">
                <input type="password" class="input-field" placeholder="Password"/>
                <box-icon class="bx bx-lock-alt"></box-icon>
            </div>
            <div class="input-box">
                <input type="submit" class="submit" value="Sign In"/> 
             {/* <!------------------- logic to be implememented for login --------> */}

            </div>
            <div class="two-col">
                <div class="one">
                    <input type="checkbox" id="login-check"/>
                    <label htmlFor="login-check"> Remember Me</label>
                </div>
                <div class="two">
                    <label><a href="#">Forgot password?</a></label>
                </div>
            </div>
        </div>

        {/* <!------------------- registration form --------------------------> */}
        <div class="register-container" id="register">
            <div class="top">
                <span>Have an account? <a href="#" onClick={login}>Login</a></span>
                <header>Sign Up</header>
            </div>
            <div class="radio-container">
              <div class="radio-tile-group">
                <div class="input-container">
              
                  <input type="radio" id="Patient" name="radio"/>
                  <div class="radio-tile">
                    <box-icon class='bx bxs-user bx-lg' ></box-icon>
                    <label for="Patient">Patient</label>
                  </div>
                </div>

                <div class="input-container">
                  <input type="radio" id="Doctor" name="radio"/>
                  <div class="radio-tile">
                    <box-icon class='bx bx-plus-medical bx-lg'></box-icon>
                    <label htmlFor="Doctor">Doctor</label>
                  </div>
                </div>

              </div>
            </div>
            
            <div class="two-forms">
                <div class="input-box">
                    <input type="text" class="input-field" placeholder="Firstname"/>
                    <box-icon className="bx bx-user"></box-icon>
                </div>
                <div class="input-box">
                    <input type="text" class="input-field" placeholder="Lastname"/>
                    <box-icon className="bx bx-user"></box-icon>
                </div>
            </div>
            <div className="input-box">
                <input type="text" className="input-field" placeholder="Email"/>
                <box-icon className="bx bx-envelope"></box-icon>
            </div>
            <div className="input-box">
                <input type="password" className="input-field" placeholder="Password"/>
                <box-icon className="bx bx-lock-alt"></box-icon>
            </div>
            <div class="input-box">
                <input type="submit" class="submit" value="Register"/>  
                {/* <!------------------- logic to be implememented for register --------> */}
            </div>
            <div class="two-col">
                <div class="one">
                    <input type="checkbox" id="register-check"/>
                    <label htmlFor="register-check"> Remember Me</label>
                </div>
            </div>
        </div>
    </div>
 </div>   
</div>
    )
}

function myMenuFunction() {
    let i = document.getElementById("navMenu");

    if(i.className === "nav-menu") {
        i.className += " responsive";
    } else {
        i.className = "nav-menu";
    }
}

let a = document.getElementById("loginBtn");
let b = document.getElementById("registerBtn");
let x = document.getElementById("login");
let y = document.getElementById("register");

function login() {
    x.style.left = "4px";
    y.style.right = "-520px";
    a.className = "btn";
    b.className += " white-btn";
}

function register() {
    x.style.left = "-510px";
    y.style.right = "5px";
    a.className = "btn";
    b.className += " white-btn";
    x.style.opacity = 0;
    y.style.opacity = 1;
}
export default NavBar;