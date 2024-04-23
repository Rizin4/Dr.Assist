import React from "react";
import MUIDataTable from "mui-datatables";
import {} from '@mui/material/styles';
import { ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import "./DocHome.css";
import Button from '@mui/material/Button';

import { styled } from '@mui/material/styles';
import axios from "axios";
import SendIcon from '@mui/icons-material/Send';


const ListDoc = () => {

  const handleClickOpen = async (value) => {
    const reportId =localStorage.getItem("report_id");
    console.log(value);
    console.log(reportId);
    const access_token = localStorage.getItem('access_token');
    const data = {
        report_id: reportId,
        doctor_id: value,
      };
  await axios.post('http://localhost:8000/api/share-report-with-doctor/', data ,{
      headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'}
  })
      .then(function(response) {
          console.log(response.data);
          alert("File shared with doctor successfully");
      })
      .catch(error => console.log(error));
      

      localStorage.removeItem("report_id");
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
        label:"Name"
    },  
   

    {
        name:"id",
        label:"Share Report",
        options:{
            
            customBodyRender: (value) =>(
            <Button onClick={(e) => handleClickOpen(value, e)} variant="contained" endIcon={<SendIcon />}>Share Report</Button>    
            ),
            filter:false,
        },

    },
];

const [users, setUsers] = useState([]);


useEffect(() => {

  const access_token = localStorage.getItem('access_token');
  axios.get('http://localhost:8000/api/list-doctors/', {
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
  rowsPerPage: 15,
  rowsPerPageOptions: [15,30,45,60],
  responsive: "standard", 
  download :"false",
  print : "false",
  viewColumns:"false"
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


         <ThemeProvider theme={getMuiTheme()}>
        <div className="container-page"> <MUIDataTable className="container-page"
                title={"Select the doctor you wish to share your report with:"}
                data={users}
                columns={columns}
                options={options}
                />
        </div>
        </ThemeProvider>
        </div>
    );
}

export default ListDoc;