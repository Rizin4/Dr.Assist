import { useState } from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

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
    name: "",
    email: "",
    password: "",
    dateofbirth: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign-in logic here, such as sending form data to backend
    console.log("Sign-in form data:", formData);
    navigate("/login");
  };


    const [alignment, setAlignment] = useState('web');
  
    const handleAlignmentChange = (event, newAlignment) => {
      setAlignment(newAlignment);
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
          id="name"
          label="Name"
          name="name"
          value={formData.name}
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
          id="Password"
          label="Password"
          name="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="ConfirmPassword"
          label="Confirm Password"
          name="ConfirmPassword"
          value={formData.ConfirmPassword}
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
        onChange={handleAlignmentChange}
        aria-label="User Type"
        >
        <ToggleButton value="Patient">Patient</ToggleButton>
        <ToggleButton value="Doctor">Doctor</ToggleButton>
        
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