import React from "react";
import MUIDataTable from "mui-datatables";
import {} from '@mui/material/styles';
import { ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import "./DocHome.css";
import { jwtDecode } from "jwt-decode";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';



const PatientPastSum = () => {
    

    const username=localStorage.getItem("userName");


const columns = [
    
    {
        name:"id",
        label:"Serial No."
    },

    {
        name:"firstName",
        label:"Name"
    },  
   
    {
        name:"domain",
        label:"Patient Report",
        options:{
            
        customBodyRender: (value) =>(
           <Button variant="contained" href={'https://'+value} target="_blank"> View Report
            </Button> 
        ),
        filter:false,
    },
    }, 
    {
        name:"domain",
        label:"Share Report",
        options:{
            customBodyRender: (value) =>(
                <Stack direction="row" spacing={2}>
                <Button variant="contained" href="#contained-buttons"endIcon={<SendIcon />}>
                  Send Report
                </Button>
                <Button variant="outlined"  color="error" startIcon={<DeleteIcon />}>
                  Delete 
                </Button>
              </Stack>
             ),
             filter:false,
         },       
    }
];

const [users, setUsers] = useState([]);


useEffect(() => {

    fetch('https://dummyjson.com/users')
    .then(res => res.json())
    .then((data) =>setUsers(data?.users));
                
},[]);

const options = {
  filterType: 'checkbox',
  selectableRows: false,
  rowsPerPage: 5,
  rowsPerPageOptions: [5,10,15,20],
};

const getMuiTheme = () => 
createTheme({
    typography:{
        fontFamily: "Poppins",

    },
    palette: {
        background: {
            default: "#f4f5fd",
            paper: "#f4f5fd"
        },
        mode: "light"
    },
});
    return (
        <div className=""> 
                <h2 className="h2">{`Hello ${username} `}</h2>

         <ThemeProvider theme={getMuiTheme()}>
        <div className="container-page"> <MUIDataTable className="container-page"
                title={"Patient List"}
                data={users}
                columns={columns}
                options={options}
                />
        </div>
        </ThemeProvider>
        </div>
    );

}


export default PatientPastSum;