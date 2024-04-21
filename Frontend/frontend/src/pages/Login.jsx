import { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const FormContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const LoginForm = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
    };
    try {
      const { data } = await axios.post("http://localhost:8000/api/token/", user,
        { headers: { 'Content-Type': 'application/json' } },
        { withCredentials: true })
      // .then(response => {console.log(data);} );
      localStorage.clear();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      const isDoctor =data.isDoctor
      {data.access!=null? ( localStorage.setItem("isAuth", true)):(localStorage.setItem("isAuth",false))}
      if (data.access) {
        const decoded = jwtDecode(data.access);
        console.log(decoded);
        const userName = decoded.username;
        localStorage.setItem("userName", userName);
        console.log(localStorage.getItem("userName"));
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;

      const response = await axios.get('http://localhost:8000/api/chatbot-token/', {
        headers: {
          'Authorization': `Bearer ${data.access}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        console.log('chatbot_token:', response.data.access_token);
        localStorage.setItem('rasa_jwt', response.data.access_token);
      } else {
        console.error('Error:', response.status, response.statusText);
      }
      console.log("doc:"+isDoctor);
      if (isDoctor) {
        navigate("/DocHome");
      } else {
        navigate("/PastSum");
      }
    } catch (error) {
      console.error(error);
      alert('Invalid credentials');
    }
   
  }
  // useEffect(() => {
  //   if(localStorage.getItem('access_token') === null){
  //     alert('Invalid credentials');  
  //   }

  return (
    <FormContainer component="main" maxWidth="xs">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <LoginForm onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <SubmitButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Login
        </SubmitButton>
      </LoginForm>
    </FormContainer>
  );
};

export default Login;