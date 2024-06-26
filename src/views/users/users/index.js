import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Paper, TextField, Button, Typography } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import MainCard from '../../../ui-component/cards/MainCard';
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
import { gridSpacing } from '../../../store/constant';
import { useHistory } from 'react-router-dom';
import configData from '../../../config';

const SamplePage = () => {
    const history = useHistory();

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState(null);
    const [forbidden, setforbidden] = useState(false);
    const [usersPermission, setUsersPermission] = useState([]);
    const handleDelete = (userId) => {
        setUserToDeleteId(userId);
        setDeleteDialogOpen(true);
    };

    let checkpermissions = () => {
        let Lantern = localStorage.getItem('Lantern-account');
        let tokenObj = JSON.parse(Lantern);
        let token = JSON.parse(tokenObj.perm);
        let userPermissions = token.filter(permission => permission.includes("user"));
        setUsersPermission(userPermissions);
    }

    useEffect(() => {
        checkpermissions()
    }, [])
    const handleDeleteConfirmation = () => {
        let Lantern = localStorage.getItem('Lantern-account')
        let tokenObj = JSON.parse(Lantern)
        let token = tokenObj.token


        axios.delete(configData.API_SERVER + `users/${userToDeleteId}`, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {
                getUsers()
                setDeleteDialogOpen(false)
                setSnackbarMessage({ color: "green", msg: res.data.message }); // Set response data to display in the snackbar
                setSnackbarOpen(true); // Open the snackbar
                setTimeout(() => { handleSnackbarClose() }, 1500)

            })
            .catch((err) => {
                setSnackbarMessage({ color: "red", msg: err.response.data.message });
                setSnackbarOpen(true); // Open the snackbar

            })
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false); // Close the delete confirmation dialog
    };


    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [users, searchTerm]);

    const getUsers = () => {
        try {

            let Lantern = localStorage.getItem('Lantern-account')
            let tokenObj = JSON.parse(Lantern)
            let token = tokenObj.token

            axios.get(configData.API_SERVER + 'users', {
                headers: {
                    'Authorization': JSON.parse(token)
                }
            })
                .then((res) => {
                    setUsers(res.data);
                    applyFilters(); // Apply filters initially
                })
                .catch((err) => {
                    if (err.response.data.message == 'Forbidden') {
                        setforbidden(true)
                    }
                });
        } catch (err) { console.log(err) }
    }

    const applyFilters = () => {
        const filtered = users.filter(user =>
            user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
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


    const handleSnackbarClose = () => {
        setSnackbarOpen(false); // Close the snackbar
    };



    return (
        <MainCard title="Utilisateurs">
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
                        backgroundColor: snackbarMessage.color,
                    }}
                    message={snackbarMessage.msg}
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
                        Êtes-vous sûr de vouloir supprimer cet utilisateur ?
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
            {/* {
                forbidden ? "Vous n'êtes pas autorisé à continuer" : */}
            <>

                {usersPermission.includes('user_add') && <Grid container justifyContent="flex-end" item xs={12} onClick={() => history.push(`/ajouter-utilisateur`)}>
                    <Button variant="outlined" color="primary">
                        Ajouter Un Utilisateur
                    </Button>
                </Grid>}

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
                                    <TableCell>Téléphone</TableCell>
                                    <TableCell>E-mail</TableCell>
                                    {(usersPermission.includes('user_delete') || usersPermission.includes('user_update')) &&
                                        <TableCell>Actions</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, i) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.fullname}</TableCell>
                                        <TableCell>{row.phone}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>

                                            <>
                                                {usersPermission.includes('user_update') &&
                                                    <IconButton style={{ color: "#2073c4" }} aria-label="edit" onClick={() => history.push(`/edit-utilisateur/${row.id}`)}>
                                                        <EditIcon />
                                                    </IconButton>}
                                                {usersPermission.includes('user_delete') &&
                                                    <IconButton style={{ color: "#c42020" }} aria-label="delete" onClick={() => handleDelete(row.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>}
                                            </>

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
            </>
            {/* } */}
        </MainCard>
    );
};

export default SamplePage;
