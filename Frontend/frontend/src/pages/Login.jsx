import { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
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

  const handleSubmit = (event) => {
    event.preventDefault();
    // Hardcoded credentials for demo purposes
    const hardcodedEmail = "john@gmail.com";
    const hardcodedPassword = "john@gmail.com";

    if (email === hardcodedEmail && password === hardcodedPassword) {
      // Redirect to /home upon successful login
      localStorage.setItem("isAuth", true);
      localStorage.setItem("userName", hardcodedEmail);
      navigate("/home");
    } else {
      alert("Invalid email or password. Please try again.");
    }
  };

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