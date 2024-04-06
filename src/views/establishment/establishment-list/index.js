import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Paper, TextField, Button, Typography } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon, PersonAdd } from '@material-ui/icons';
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

const Etablissement = () => {
    const history = useHistory();

    const [establishments, setEstablishment] = useState([]);
    const [filteredestablishments, setFilteredestablishments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState(null);
    const [forbidden, setforbidden] = useState(false);
    const [establishmentsPermission, setEstablishmentPermission] = useState([]);
    const handleDelete = (userId) => {
        setUserToDeleteId(userId);
        setDeleteDialogOpen(true);
    };

    let checkpermissions = () => {
        let Lantern = localStorage.getItem('Lantern-account');
        let tokenObj = JSON.parse(Lantern);
        let token = JSON.parse(tokenObj.perm);
        let userPermissions = token.filter(permission => permission.includes("user"));
        setEstablishmentPermission(userPermissions);
    }

    useEffect(() => {
        checkpermissions()
    }, [])
    const handleDeleteConfirmation = () => {
        let Lantern = localStorage.getItem('Lantern-account')
        let tokenObj = JSON.parse(Lantern)
        let token = tokenObj.token


        axios.delete(configData.API_SERVER + `establishments/${userToDeleteId}`, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {
                getEstablishment()
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
        getEstablishment();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [establishments, searchTerm]);

    const getEstablishment = () => {
        try {

            let Lantern = localStorage.getItem('Lantern-account')
            let tokenObj = JSON.parse(Lantern)
            let token = tokenObj.token

            axios.get(configData.API_SERVER + 'establishments', {
                headers: {
                    'Authorization': JSON.parse(token)
                }
            })
                .then((res) => {
                    console.log(res.data);
                    setEstablishment(res.data);
                    applyFilters(); // Apply filters initially
                })
                .catch((err) => {
                    console.log(err.response);
                    if (err.response.data.message == 'Forbidden') {
                        setforbidden(true)
                    }
                });
        } catch (err) { console.log(err) }
    }

    const applyFilters = () => {
        const filtered = establishments.filter(user =>
            user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredestablishments(filtered);
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
        <MainCard title="Etablissements">
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
                        Êtes-vous sûr de vouloir supprimer cet Etablissement ?
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
            {
                forbidden ? "Vous n'êtes pas autorisé à continuer" :
                    <>

                        {establishmentsPermission.includes('user_add') && <Grid container justifyContent="flex-end" item xs={12} onClick={() => history.push(`/ajouter-etablissement`)}>
                            <Button variant="outlined" color="primary">
                                Ajouter Un Etablissement
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

                        {establishments?.length ?
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Logo</TableCell>
                                            <TableCell>Nom</TableCell>
                                            <TableCell>E-mail</TableCell>
                                            <TableCell>Description</TableCell>
                                            {(establishmentsPermission.includes('user_delete') || establishmentsPermission.includes('user_update')) &&
                                                <TableCell>Actions</TableCell>}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredestablishments.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, i) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{row.id}</TableCell>
                                                <TableCell>
                                                    <img src={'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'} style={{ resize: "contain", height: "50px", width: "50px", borderRadius: "10px" }} />
                                                </TableCell>
                                                <TableCell>{row.name.length > 10 ? row.name.slice(0, 10) + '...' : row.name}</TableCell>
                                                <TableCell>{row.email.length > 30 ? row.email.slice(0, 30) + '...' : row.email}</TableCell>
                                                <TableCell>{row.description.length > 40 ? row.description.slice(0, 40) + '...' : row.description}</TableCell>
                                                <TableCell>

                                                    <>
                                                        {establishmentsPermission.includes('user_update') &&
                                                            <IconButton style={{ color: "#000" }} aria-label="edit" onClick={() => history.push(`/affect-establissement/${row.id}`)}>
                                                                <PersonAdd />
                                                            </IconButton>}
                                                        {establishmentsPermission.includes('user_update') &&
                                                            <IconButton style={{ color: "#2073c4" }} aria-label="edit" onClick={() => history.push(`/edit-etablissement/${row.id}`)}>
                                                                <EditIcon />
                                                            </IconButton>}
                                                        {establishmentsPermission.includes('user_delete') &&
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
                            <Button onClick={() => handleChangePage(null, page + 1)} disabled={page >= Math.ceil(filteredestablishments.length / rowsPerPage)}>Suivant</Button>
                            <span>Page {page} of {Math.ceil(filteredestablishments.length / rowsPerPage)}</span>
                            <select value={rowsPerPage} onChange={handleChangeRowsPerPage}>
                                {[5, 10, 25].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
            }
        </MainCard>
    );
};

export default Etablissement;
