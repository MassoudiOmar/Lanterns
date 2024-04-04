import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Grid, Box, Snackbar, SnackbarContent, InputAdornment } from '@material-ui/core';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import MainCard from '../../../ui-component/cards/MainCard';
import configData from '../../../config';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Paper, Typography } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';

const EditEstablishment = () => {
    const history = useHistory();
    const { id } = useParams();
    const [Roles, setRoles] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState({ color: '', msg: '' });
    const [user, setUser] = useState([])
    useEffect(() => {
        getEstablishment();
    }, []);
    const [usersPermission, setUsersPermission] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState(null);
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
    const handleDelete = (userId) => {
        setUserToDeleteId(userId);
        setDeleteDialogOpen(true);
    };

    const getEstablishment = async () => {
        try {
            const token = JSON.parse(getToken());
            const res = await axios.get(configData.API_SERVER + `establishments/${id}`, {
                headers: {
                    'Authorization': token
                }
            });
            setUser(res.data);
        } catch (error) {
            handleRequestError(error);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            console.log(user)
            const token = JSON.parse(getToken());
            await axios.put(configData.API_SERVER + `establishments/${id}`, user, {
                headers: {
                    'Authorization': token
                }
            });
            handleSuccess('User Edited');
            setTimeout(() => {
                history.goBack();
            }, 2000);
        } catch (error) {
            handleRequestError(error);
        }
    };

    const getToken = () => {
        const Lantern = localStorage.getItem('Lantern-account');
        const tokenObj = JSON.parse(Lantern);
        return tokenObj.token;
    };

    const handleRequestError = (error) => {
        let errorMessage = error.response?.data?.msg || error.response?.data || "An error occurred";
        if (error.response?.status === 403) {
            errorMessage = 'Forbidden';
        }
        setSnackbarMessage({ color: "red", msg: errorMessage });
        setSnackbarOpen(true);
    };

    const handleSuccess = (message) => {
        setSnackbarMessage({ color: "green", msg: message });
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUser({ ...user, image: file.name, file: file });
        }
    };
    const fileInputRef = useRef(null);

    const handleEditIconClick = () => {
        fileInputRef.current.click();
    };

    return (
        <MainCard title="Edit Etablissement">
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
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="name"
                        label="Nom"
                        variant="outlined"
                        fullWidth
                        value={user.name}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="description"
                        label="Description"
                        variant="outlined"
                        fullWidth
                        value={user.description}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="email"
                        label="E-mail"
                        variant="outlined"
                        fullWidth
                        value={user.email}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="phone"
                        label="phone"
                        variant="outlined"
                        fullWidth
                        value={user.phone}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        name="image"
                        label="Nom de la fichier"
                        variant="outlined"
                        fullWidth
                        value={user.image}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment onClick={handleEditIconClick} position="end">
                                    <Button variant="contained" color="primary" component="span">
                                        Sélectionnez une fichier
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="createdAt"
                        label="Created At"
                        variant="outlined"
                        fullWidth
                        disabled
                        value={user.createdAt}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="updatedAt"
                        label="Updated At"
                        variant="outlined"
                        fullWidth
                        disabled
                        value={user.updatedAt}
                    />
                </Grid>
                <Grid item xs={12} sm={12} >
                    <Box display="flex" justifyContent="center" position="relative">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*,.pdf"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}

                        />
                        {user.file ? (
                            <div>
                                <img
                                    src={URL.createObjectURL(user.file)}
                                    alt="Selected Image"
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        borderRadius: 10,
                                        cursor: 'pointer',
                                    }}
                                />
                            </div>
                        ) : (
                            <div>
                                <p>Aucun fichier sélectionné</p>
                            </div>
                        )}
                    </Box>
                </Grid>
                <MainCard title="Utilisateurs inclus" style={{ width: "100%" }} >
                    {usersPermission.includes('lesson_add') &&
                        <Grid container justifyContent="flex-end" item xs={12} onClick={() => history.push(`/ajoute-chapitre`)}>
                            <Button variant="outlined" color="primary">
                                Ajouter un leçons
                            </Button>
                        </Grid>}
                    {user?.length ?
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Nom</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Status</TableCell>
                                        {(usersPermission.includes('lesson_delete') || usersPermission.includes('lesson_update')) &&
                                            <TableCell>Actions</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {user?.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, i) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>{row?.name}</TableCell>
                                            <TableCell>{row?.email}</TableCell>
                                            <TableCell>
                                                {
                                                    <>
                                                        {usersPermission.includes('lesson_update') &&
                                                            <IconButton style={{ color: "#2073c4" }} aria-label="edit" onClick={() => history.push(`/edit-chapitre/${row.id}`)}>
                                                                <EditIcon />
                                                            </IconButton>}
                                                        {usersPermission.includes('lesson_delete') &&
                                                            <IconButton style={{ color: "#c42020" }} aria-label="delete" onClick={() => handleDelete(row.id)}>
                                                                <DeleteIcon />
                                                            </IconButton>}
                                                    </>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer> :
                        <span>il n'y a pas de utilisateurs</span>
                    }
                </MainCard>

                <Grid item xs={12} sm={12}>
                    <Button variant="outlined" color="primary" onClick={handleSubmit}>
                        Edite Etablissement
                    </Button>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default EditEstablishment;
