import React from "react";
import MUIDataTable from "mui-datatables";
import {} from '@mui/material/styles';
import { ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import "./DocHome.css";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import axios from "axios";
import Chip from '@mui/material/Chip';

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
    
      const handleFileUpload = (value,e) => {
        const file = e.target.files[0];
        console.log(file);
        console.log(users);
        const access_token = localStorage.getItem('access_token');
        const formData = new FormData();
        formData.append("file", file);
        axios.post(`${process.env.REACT_APP_DJANGO_SERVER}/api/doctor-append/${value}/` , formData, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'multipart/form-data'
            }
          })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      };

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
        name:"username",
        label:"patient Name"
    },  
    {
        name: "created_at",
        label: "Creation Time"
    },
    {
        name: "isModified",
        label: "Report Status",
        options: {
            customBodyRender: (value) => (
                (value ==true) ? (
                    <Chip label="Reviewed" color="success" />
                ) : (
                    <Chip label="Pending Review" color="warning" />
                )
            ),
 
        },
    },
    {
        name:"file",
        label:"Patient Report",
        options:{
            
        customBodyRender: (value) =>(
            <Button variant="contained" href={'http://localhost:8000'+value} target="_blank"> View Report
            </Button> 
             
        ),
        filter:false,
    },
    }, 
    {
        name:"id",
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
                <VisuallyHiddenInput type="file" onChange={(e)=>handleFileUpload(value,e)} />
                </Button>        
            ),
            filter:false,
        },

    },
];

const [users, setUsers] = useState([]);


useEffect(() => {

    const access_token = localStorage.getItem('access_token');
    axios.get('http://localhost:8000/api/view-received-pdfs/', {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(function(response) {
            console.log(response.data);
            setUsers(response.data);
        })
        .catch(error => console.log(error));
                
},1000);

const options = {
  filterType: 'dropdown',
  selectableRows: false,
  rowsPerPage: 5,
  rowsPerPageOptions: [5,10,15,20],
  responsive: "standard", 
  download :"false",
  print : "false",
  viewColumns:"false",
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
                <h2 className="h2"> Welcome Back {userName}</h2>

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