import React from "react";
import MUIDataTable from "mui-datatables";
import { } from '@mui/material/styles';
import { ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import "./DocHome.css";
import { jwtDecode } from "jwt-decode";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { name } from "dayjs/locale/en-gb";
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios";
import UserHome from "./ListDoc";
import ListDoc from "./ListDoc";



const PatientPastSum = () => {


    const username = localStorage.getItem("userName");
    const [open, setOpen] = React.useState(false);



    const handleClickOpen = (value) => {
        setOpen(true);
        localStorage.setItem("report_id", value);
        console.log(value);
    };

    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
        }
    };

   
    const columns = [

        {
            name: "id",
            label: "Serial No.",
            filter: false,
        },

        {
            name: "created_at",
            label: "Creation Time"
        },

        {
            name: "file",
            label: "Patient Report",
            options: {

                customBodyRender: (value) => (
                    <Button variant="contained" href={'http://127.0.0.1:8000' + value} target="_blank"> View Report
                    </Button>
                ),
                filter: false,
            },
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
            name: "id",
            label: "Share Report",
            options: {
                customBodyRender: (value) => (
                    
                    <Stack direction="row" spacing={2}>
                        <Button onClick={(e) => handleClickOpen(value, e)} variant="contained" endIcon={<SendIcon />}>Send Report</Button>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Choose a Doctor</DialogTitle>
                            <DialogContent>
                                <Box component="form"  sx={{ display: 'flex', flexWrap: 'wrap' }}>

                               <ListDoc/>
                                    
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button onClick={handleClose}>Ok</Button>
                            </DialogActions>
                        </Dialog>
                        <Button variant="outlined" color="error" onClick={(e) => handledelete(value,e)} startIcon={<DeleteIcon />}>
                            Delete Report
                        </Button>
                    </Stack>
                ),
                filter: false,
            },
        }
    ];

    const [users, setUsers] = useState([]);
    const [update,setUpdate]=useState('');


    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        axios.get('http://localhost:8000/api/report-gallery/', {
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

    }, [update]);

    const handledelete = (value) => {
        console.log(value);
        const access_token = localStorage.getItem('access_token');
        axios.delete('http://localhost:8000/api/report-gallery/'+value, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(function(response) {
                console.log(response.data);
                alert('Report Deleted Successfully');
                setUpdate(response.data);
   })
            .catch(error => console.log(error));

    }

    const options = {
        filterType: 'dropdown',
        selectableRows: false,
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 15, 20],
        download :"false",
        print : "false",
        viewColumns:"false",
        responsive: "standard",
    };

    const getMuiTheme = () =>
        createTheme({
            typography: {
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
                <div className="container-page">
                    <MUIDataTable className="container-page"
                    title={"Your Generated Reports"}
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