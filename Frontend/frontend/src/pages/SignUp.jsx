import { useState } from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/en-gb';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import axios from 'axios';

const SignInContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const SignInForm = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));

const SignUp = () => {
  const [formData, setFormData] = useState({
    "email": "",
    "username": "",
    "password": "",
    "password2": "",
    "isDoctor": false
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    console.log(formData);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sign-in form data:", formData);
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('password2', formData.password2);
    data.append('isDoctor', formData.isDoctor);
    console.log(data);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    navigate("/login");
  };


  const [alignment, setAlignment] = useState('web');

  const handleAlignmentChange = (event) => {
    setAlignment(event.target.value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <SignInContainer component="main" maxWidth="xs">
        <Typography variant="h4" gutterBottom>
          Sign In
        </Typography>
        <SignInForm onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Name"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password2"
            label="Confirm Password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
          />
          <DatePicker
            variant="outlined"
            margin="normal"
            label="Date of Birth"

          />
          <ToggleButtonGroup

            color="primary"
            value={alignment}
            exclusive
            onChange={(e) => {
              handleAlignmentChange(e)
              handleChange(e)
            }}
            aria-label="User Type"
          >
            <ToggleButton name="isDoctor" value='false' >Patient</ToggleButton>
            <ToggleButton name="isDoctor" value='true'  >Doctor</ToggleButton>

          </ToggleButtonGroup>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Sign In
          </Button>
        </SignInForm>
        <Box mt={2}>
          <Typography variant="body2">
            Already have an account?
            <Link to="/" className="text-lg text-blue-700">
              Login
            </Link>
          </Typography>
        </Box>
      </SignInContainer>
    </LocalizationProvider>
  );
};

export default SignUp;