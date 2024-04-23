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
    
      const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        axios.post("127.0.0.1:8000/api/doctor-append/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-rapidapi-host": "file-upload8.p.rapidapi.com",
              "x-rapidapi-key": "your-rapidapi-key-here",
            },
          })
          .then((response) => {
            // handle the response
            console.log(response);
          })
          .catch((error) => {
            // handle errors
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
                <VisuallyHiddenInput type="file/" onChange={handleFileUpload} />
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
                
},[]);

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