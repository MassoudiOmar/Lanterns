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
import configData from '../../../../config';

const CallBack = () => {
    const history = useHistory();

    const [users, setUsers] = useState([
        {
            email: "student@lanterns.com",
            phone: "59846532",
            estableshment: "lanterns",
            purpose: "Partnership",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam diam felis, pellentesque vitae blandit vel, gravida eget ex. Aenean a tincidunt risus, at egestas ante. Etiam ut quam metus. Fusce tristique nisl a tincidunt facilisis. Cras et nisi ligula. Integer vitae velit leo. Donec bibendum urna ante, sed euismod eros aliquam eget. Pellentesque rutrum ligula urna, non ornare magna ultricies a. Maecenas euismod lacus a ullamcorper dapibus. Fusce cursus sit amet quam id egestas. Duis eget ante ligula. Aenean blandit ligula ac congue blandit. Praesent ultricies libero eget dolor efficitur, in maximus turpis malesuada. Suspendisse vestibulum tincidunt enim at hendrerit. Vivamus gravida gravida turpis, vel maximus felis faucibus eget. Duis dui risus, sodales eu justo interdum, vehicula gravida orci. Maecenas pellentesque porttitor ante, in feugiat nibh suscipit at. Pellentesque faucibus nunc at faucibus laoreet. Curabitur et lacus a arcu cursus laoreet. Duis consequat, enim sed condimentum mollis, enim ipsum luctus sem, eu auctor purus arcu eget eros. Maecenas vitae feugiat neque. Integer maximus, velit non elementum hendrerit, lectus erat aliquet lectus, vel faucibus ante purus ut leo.Curabitur quis urna a erat condimentum euismod. Ut euismod justo vehicula ex cursus tempus. Nunc ornare, enim in scelerisque tincidunt, massa metus varius. ",
            createdAt: "2024-03-26 14:08:40"
        },
        {
            email: "student1@lanterns.com",
            phone: "59846532",
            estableshment: "Student",
            purpose: "Partnership",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam diam felis, pellentesque vitae blandit vel, gravida eget ex. Aenean a tincidunt risus, at egestas ante. Etiam ut quam metus. Fusce tristique nisl a tincidunt facilisis. Cras et nisi ligula. Integer vitae velit leo. Donec bibendum urna ante, sed euismod eros aliquam eget. Pellentesque rutrum ligula urna, non ornare magna ultricies a. Maecenas euismod lacus a ullamcorper dapibus. Fusce cursus sit amet quam id egestas. Duis eget ante ligula. Aenean blandit ligula ac congue blandit. Praesent ultricies libero eget dolor efficitur, in maximus turpis malesuada. Suspendisse vestibulum tincidunt enim at hendrerit. Vivamus gravida gravida turpis, vel maximus felis faucibus eget. Duis dui risus, sodales eu justo interdum, vehicula gravida orci. Maecenas pellentesque porttitor ante, in feugiat nibh suscipit at. Pellentesque faucibus nunc at faucibus laoreet. Curabitur et lacus a arcu cursus laoreet. Duis consequat, enim sed condimentum mollis, enim ipsum luctus sem, eu auctor purus arcu eget eros. Maecenas vitae feugiat neque. Integer maximus, velit non elementum hendrerit, lectus erat aliquet lectus, vel faucibus ante purus ut leo.Curabitur quis urna a erat condimentum euismod. Ut euismod justo vehicula ex cursus tempus. Nunc ornare, enim in scelerisque tincidunt, massa metus varius. ",
            createdAt: "2024-03-26 14:08:40"
        },
        {
            email: "student2@lanterns.com",
            phone: "59846532",
            estableshment: "lanterns",
            purpose: "Quote",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam diam felis, pellentesque vitae blandit vel, gravida eget ex. Aenean a tincidunt risus, at egestas ante. Etiam ut quam metus. Fusce tristique nisl a tincidunt facilisis. Cras et nisi ligula. Integer vitae velit leo. Donec bibendum urna ante, sed euismod eros aliquam eget. Pellentesque rutrum ligula urna, non ornare magna ultricies a. Maecenas euismod lacus a ullamcorper dapibus. Fusce cursus sit amet quam id egestas. Duis eget ante ligula. Aenean blandit ligula ac congue blandit. Praesent ultricies libero eget dolor efficitur, in maximus turpis malesuada. Suspendisse vestibulum tincidunt enim at hendrerit. Vivamus gravida gravida turpis, vel maximus felis faucibus eget. Duis dui risus, sodales eu justo interdum, vehicula gravida orci. Maecenas pellentesque porttitor ante, in feugiat nibh suscipit at. Pellentesque faucibus nunc at faucibus laoreet. Curabitur et lacus a arcu cursus laoreet. Duis consequat, enim sed condimentum mollis, enim ipsum luctus sem, eu auctor purus arcu eget eros. Maecenas vitae feugiat neque. Integer maximus, velit non elementum hendrerit, lectus erat aliquet lectus, vel faucibus ante purus ut leo.Curabitur quis urna a erat condimentum euismod. Ut euismod justo vehicula ex cursus tempus. Nunc ornare, enim in scelerisque tincidunt, massa metus varius. ",
            createdAt: "2024-03-26 14:08:40"
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

        axios.delete(`${configData.API_SERVER}categories/${userToDeleteId}`, {
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

            axios.get(`${configData.API_SERVER}` +"categories", {
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
        axios.put(`${configData.API_SERVER}users/${id}`, data, {
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


    return (
        <MainCard title="CallBack">
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

            {/* <Grid container justifyContent="flex-end" item xs={12} onClick={() => history.push(`/ajoute-categorie`)}>
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
                                <TableCell>E-mail</TableCell>
                                <TableCell>Téléphone</TableCell>
                                <TableCell>Établissement</TableCell>
                                <TableCell>Objectif</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Date De Création</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, i) => (
                                <TableRow key={row.id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{row?.email}</TableCell>
                                    <TableCell>{row?.phone}</TableCell>
                                    <TableCell>{row?.estableshment}</TableCell>
                                    <TableCell>{row?.purpose}</TableCell>
                                    <TableCell>{row.description.length > 20 ? row.description.slice(0, 20) + '...' : row.description}</TableCell>
                                    <TableCell>{row?.createdAt?.split(' ')[0]}</TableCell>

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

export default CallBack;
