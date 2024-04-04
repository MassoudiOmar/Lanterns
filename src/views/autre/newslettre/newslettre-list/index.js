import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Paper, TextField, Button, Typography } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import MainCard from '../../../../ui-component/cards/MainCard';
import axios from "axios"
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { Grid } from '@material-ui/core';
import Skeleton from '@material-ui/core/Skeleton';
import { gridSpacing } from '../../../../store/constant';
import { useHistory } from 'react-router-dom';
import { CSVLink, CSVDownload } from "react-csv";

const NewsLettre = () => {
    const history = useHistory();

    const [users, setUsers] = useState([
        {
            id: 1,
            email: "student@lanterns.com",
            createdAt: '2024-03-26 12:41:27'
        }
    ]);
    const [Data, setData] = useState();
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editingUserId, setEditingUserId] = useState(null); // State to track editing user ID
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState(null);
    const [usersPermission, setUsersPermission] = useState([]);


    let checkpermissions = () => {
        let Lantern = localStorage.getItem('Lantern-account');
        let tokenObj = JSON.parse(Lantern);
        let token = JSON.parse(tokenObj.perm);
        let userPermissions = token.filter(permission => permission.includes("lesson"));
        setUsersPermission(userPermissions);
    }
    useEffect(() => {
        checkpermissions()
    }, [])


    const handleDelete = (userId) => {
        setUserToDeleteId(userId); // Set the ID of the user to be deleted
        setDeleteDialogOpen(true); // Open the delete confirmation dialog
    };
    const handleDeleteConfirmation = () => {
        let Lantern = localStorage.getItem('Lantern-account')
        let tokenObj = JSON.parse(Lantern)
        let token = tokenObj.token

        axios.delete(`http://localhost:3000/api/v1/categories/${userToDeleteId}`, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {
                getUsers()
                setDeleteDialogOpen(false)
                setSnackbarMessage(res.data.message); // Set response data to display in the snackbar
                setSnackbarOpen(true); // Open the snackbar
                setTimeout(() => { handleSnackbarClose() }, 1500)

            })
            .catch((err) => console.log(err))
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false); // Close the delete confirmation dialog
    };


    // useEffect(() => {
    //     getUsers();
    // }, []);

    useEffect(() => {
        applyFilters();
    }, [users, searchTerm]);

    const getUsers = () => {
        try {

            let Lantern = localStorage.getItem('Lantern-account')
            let tokenObj = JSON.parse(Lantern)
            let token = tokenObj.token

            axios.get('http://localhost:3000/api/v1/users', {
                headers: {
                    'Authorization': JSON.parse(token)
                }
            })
                .then((res) => {
                    setUsers(res.data);
                    applyFilters(); // Apply filters initially
                })
                .catch((err) => console.log(err.response));
        } catch (err) { console.log(err) }
    }

    const applyFilters = () => {
        const filtered = users.filter(user =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleEdit = (userId) => {
        setEditingUserId(userId); // Set editing user ID
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleUpdateUser = () => {
        let id = Data[0].id;
        let data = Data[0];
        let Lantern = localStorage.getItem('Lantern-account')
        let tokenObj = JSON.parse(Lantern)
        let token = tokenObj.token
        axios.put(`http://localhost:3000/api/v1/users/${id}`, data, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {
                getUsers();
                setEditingUserId(null);
                setSnackbarMessage(res.data.message); // Set response data to display in the snackbar
                setSnackbarOpen(true); // Open the snackbar
                setTimeout(() => { handleSnackbarClose() }, 1500)
            })
            .catch((err) => console.log(err.response));
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false); // Close the snackbar
    };

    const csvData = [
        ["email", 'created at'],
        ["student@lanterns.com", "2024-03-26 12:41:27"],
    ];

    const buttonContainerStyle = {
        textAlign: 'right', // Align button to the right
    };

    const buttonStyle = {
        backgroundColor: 'transparent',
        color: '#007bff',
        padding: '10px 20px',
        textDecoration: 'none',
        border: '1px solid #007bff',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    };

    const hoverStyle = {
        backgroundColor: '#007bff',
        color: '#fff',
    };

    return (
        <MainCard title="Newsletter">
            <div style={buttonContainerStyle}>
                <CSVLink data={csvData} style={buttonStyle} activeStyle={hoverStyle}>
                    Download CSV
                </CSVLink>
            </div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <SnackbarContent
                    style={{
                        backgroundColor: '#4caf50', // Green color for success
                    }}
                    message={snackbarMessage}
                />
            </Snackbar>
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr de vouloir supprimer cet categorie ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleDeleteConfirmation} color="primary" autoFocus>
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
            {/* 
            <Grid container justifyContent="flex-end" item xs={12} onClick={() => history.push(`/ajoute-categorie`)}>
                <Button variant="outlined" color="primary">
                    Ajouter Un Categorie
                </Button>
            </Grid> */}

            <TextField
                label="Recherche"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
                margin="normal"
            />

            {users?.length ?
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nom</TableCell>
                                <TableCell>Date De Création</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, i) => (
                                <TableRow key={row.id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.createdAt?.split('T')[0]}</TableCell>

                                    <TableCell>
                                        {
                                            <>

                                                <IconButton style={{ color: "#c42020" }} aria-label="delete" onClick={() => handleDelete(row.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer> :

                [0, 1, 2, 3, 4].map((e) => (

                    <Grid item xs={12} margin={2}>
                        <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                            <Grid item xs zeroMinWidth>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Skeleton variant="text" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Skeleton variant="rect" height={20} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Skeleton variant="rect" height={50} width={80} />
                            </Grid>
                        </Grid>
                    </Grid>
                ))}


            <div>
                <Button onClick={() => handleChangePage(null, page - 1)} disabled={page === 1}>Précédent</Button>
                <Button onClick={() => handleChangePage(null, page + 1)} disabled={page >= Math.ceil(filteredUsers.length / rowsPerPage)}>Suivant</Button>
                <span>Page {page} of {Math.ceil(filteredUsers.length / rowsPerPage)}</span>
                <select value={rowsPerPage} onChange={handleChangeRowsPerPage}>
                    {[5, 10, 25].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </MainCard>
    );
};

export default NewsLettre;
