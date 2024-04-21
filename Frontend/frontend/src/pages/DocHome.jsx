import React from "react";
import MUIDataTable from "mui-datatables";
import {} from '@mui/material/styles';
import { ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import "./DocHome.css";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';


const DocHome = () => {
    const userName = localStorage.getItem("userName") ;  

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });
      

const columns = [
    
    {
        name:"id",
        label:"Serial No."
    },
    //     {
    //         name:"image",
    //         label:"Profile",
    //         options:{
    //         customBodyRender: (value) =>(
    //         <img src={value} alt="Profile" className="prof-width prof-height"/>
    //     ),
    //     filter:false,
    // },
    //     },
    {
        name:"firstName",
        label:"Name"
    },  
    {
        name:"gender",
        options:{
            customBodyRender: (value) =>( 
            <p className="capitalize">{value}</p> 
        ),
        },
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
        name:"reply",
        label:"Upload Report",
        options:{
            
            customBodyRender: (value) =>(
                <Button
                     component="label"
                     role={undefined}
                    variant="contained"
                     tabIndex={-1}
                     startIcon={<CloudUploadIcon />}
                >
                Upload file
                <VisuallyHiddenInput type="file" />
                </Button>        
            ),
            filter:false,
        },

    },
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
                <h2 className="h2"> Welcome Back ${userName}</h2>

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

export default DocHome;