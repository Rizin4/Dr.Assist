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
  overflowY: "auto",
}));

const SignUp = () => {
  const [formData, setFormData] = useState({
    "email": "",
    "username": "",
    "password": "",
    "password2": "",
    "gender":"",
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
    data.append('gender',formData.gender);
    console.log(data);
    try {
      const response = await axios.post(`${process.env.REACT_APP_DJANGO_SERVER}/api/register/`, data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert('Error:'+error);
    }
    alert("User registered successfully, please login to continue");
    navigate("/");
  };


  const [alignment, setAlignment] = useState('web');

  const handleAlignmentChange = (event) => {
    setAlignment(event.target.value);
  };

  const [gender, setGender] = useState('web');

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <SignInContainer component="main" maxWidth="xs">
        <Typography variant="h4" gutterBottom>
          Sign Up
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
            type="password"
            id="password2"
            label="Confirm Password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            gutterBottom
          />
         
          <DatePicker
            variant="outlined"
            margin="normal"
            id="dateOfBirth"
            label="Date of Birth"
            align="left"
            style={{ width: '100%' }}
            disableFuture
            gutterBottom
          />
        
          <Typography variant="overline" component="h2" align="left" gutterBottom>
          Are you a Doctor or a Patient?
          </Typography>

          <Box display="flex" justifyContent="left">
          <ToggleButtonGroup
            
            color="primary"
            align="center"
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
          </Box>
          <Typography variant="overline" component="h2" align="left" gutterBottom>
          Please choose your gender:

          </Typography>
          <Box display="flex" justifyContent="left">
          <ToggleButtonGroup
            
            color="primary"
            align="center"
            value={gender}
            exclusive
            onChange={(e) => {
              handleGenderChange(e)
              handleChange(e)
            }}
            aria-label="Gender"
          >
            <ToggleButton name="setGender" value='M'>Male</ToggleButton>
            <ToggleButton name="setGender" value='F'>Female</ToggleButton>
            <ToggleButton name="setGender" value='O'>Other</ToggleButton>

          </ToggleButtonGroup>
          </Box>
          <Box display="flex" justifyContent="center">
          <Button
            type="submit"
            // align="center"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
          </Box>
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