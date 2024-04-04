import React, { useState, useEffect, useRef } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Paper, TextField, Button, Box, MenuItem } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import EditIcon from '@material-ui/icons/Edit';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { Grid } from '@material-ui/core';
import configData from '../../../config';

const EditCohort = () => {
    const { id } = useParams();
    const history = useHistory();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [hovered, setHovered] = useState(false);
    const fileInputRef = useRef(null);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [Lessons, setLessons] = useState([]);

    const [user, setUser] = useState({
        path_name: '',
        path_description: '',
        path_price: '',
        category_id: '',
        path_image: '',
        file: null
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState(null);
    const [usersPermission, setUsersPermission] = useState([]);
    const [page, setPage] = useState(1);
    const [Categories, setCategories] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

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

        axios.delete(configData.API_SERVER + `lessons/${userToDeleteId}`, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {
                getLessons()
                setDeleteDialogOpen(false)
                setSnackbarMessage({ color: "green", msg: res.data.message });

                setSnackbarOpen(true); // Open the snackbar
                setTimeout(() => { handleSnackbarClose() }, 1500)

            })
            .catch((err) => console.log(err))
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false); // Close the delete confirmation dialog
    };


    useEffect(() => {
        GetPath()
    }, [])

    const GetPath = async () => {
        try {
            let Lantern = localStorage.getItem('Lantern-account')
            let tokenObj = JSON.parse(Lantern)
            let token = tokenObj.token

            const response = await axios.get(configData.API_SERVER + `paths/${id}`, {
                headers: {
                    'Authorization': JSON.parse(token)
                }
            });
            setUser(response.data);
        } catch (error) {
            setSnackbarMessage({ color: "red", msg: "Failed to fetch lesson" });
            setSnackbarOpen(true);
        }
    };
    useEffect(() => {
        GetCategories()
    }, [])
    const GetCategories = async () => {
        try {
            let Lantern = localStorage.getItem('Lantern-account')
            let tokenObj = JSON.parse(Lantern)
            let token = tokenObj.token

            const response = await axios.get(configData.API_SERVER + `categories`, {
                headers: {
                    'Authorization': JSON.parse(token)
                }
            });
            setCategories(response.data);
        } catch (error) {
            setSnackbarMessage({ color: "red", msg: "Failed to fetch lesson" });
            setSnackbarOpen(true);
        }
    };
    useEffect(() => {
        getLessons()
    }, [id])
    const getLessons = async () => {
        try {
            let Lantern = localStorage.getItem('Lantern-account')
            let tokenObj = JSON.parse(Lantern)
            let token = tokenObj.token

            const response = await axios.get(configData.API_SERVER + `paths/${id}/lessons`, {
                headers: {
                    'Authorization': JSON.parse(token)
                }
            });
            setLessons(response.data);
        } catch (error) {
            setSnackbarMessage({ color: "red", msg: "Failed to fetch lesson" });
            setSnackbarOpen(true);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUser({ ...user, file: file });
        }
    };

    const handleEditIconClick = () => {
        fileInputRef.current.click();
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const tokenObj = JSON.parse(localStorage.getItem('Lantern-account'));
            const token = tokenObj.token;
            let { path_description, path_image, path_name, path_price, category_id } = user
            let data = { path_description, path_image, path_name, path_price, category_id }

            const response = await axios.put(configData.API_SERVER + `paths/${id}`, data, {
                headers: {
                    'Authorization': JSON.parse(token)
                }
            });

            setSnackbarMessage({ color: "green", msg: response.data.message });
            setSnackbarOpen(true);
            setTimeout(() => {
                history.goBack();
            }, 2000);
        } catch (error) {
            console.log(error.response)
            let errorMessage = 'Failed to update lesson';
            if (error.response && error.response.data) {
                errorMessage = error.response.data.message || error.response.data.msg || errorMessage;
            }
            setSnackbarMessage({ color: "red", msg: errorMessage });
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <MainCard title="Edit Path">
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr de vouloir supprimer cet Leçon ?
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

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="path_name"
                        label="Title"
                        variant="outlined"
                        fullWidth
                        value={user.path_name}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="path_price"
                        label="Prix"
                        variant="outlined"
                        fullWidth
                        value={user.path_price}
                        onChange={handleChange}
                    />
                </Grid>


                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        name="category_id"
                        label="Categorie"
                        variant="outlined"
                        fullWidth
                        value={user.category_id}
                        onChange={handleChange}
                    >
                        {Categories?.map((role, i) => (
                            <MenuItem key={role} value={i + 1}>
                                {role.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="path_image"
                        label="Image"
                        variant="outlined"
                        fullWidth
                        value={user.path_image}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        name="path_description"
                        label="Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={user.path_description}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
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
                                {user.file.type.startsWith('image/') ? (
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
                                ) : user.file.type.startsWith('video/') ? (
                                    <video
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                            borderRadius: 10,
                                            cursor: "pointer"
                                        }}
                                        controls
                                    >
                                        <source src={URL.createObjectURL(user.file)} type={user.file.type} />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : user.file.type === 'application/pdf' ? (
                                    <embed
                                        src={URL.createObjectURL(user.file)}
                                        type="application/pdf"

                                        maxHeight="100%"
                                        height="100px"
                                        style={{ minHeight: '600px' }}
                                    />
                                ) : (
                                    <p>Aucun aperçu disponible pour ce type de fichier</p>
                                )}
                                <IconButton
                                    onMouseEnter={() => setHovered(true)}
                                    onMouseLeave={() => setHovered(false)}
                                    onClick={handleEditIconClick}
                                    style={{ position: 'absolute', top: 10, right: 10, backgroundColor: "#fff" }}
                                >
                                    <EditIcon />
                                </IconButton>
                            </div>
                        ) : (
                            null
                        )}
                    </Box>
                </Grid>

            </Grid>
            <MainCard title="Leçons Incluses ">
                {usersPermission.includes('lesson_add') &&
                    <Grid container justifyContent="flex-end" item xs={12} onClick={() => history.push(`/ajoute-leçon/${id}`)}>
                        <Button variant="outlined" color="primary">
                            Ajouter un leçons
                        </Button>
                    </Grid>}
                {Lessons?.length ?
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Titre</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Status</TableCell>
                                    {(usersPermission.includes('lesson_delete') || usersPermission.includes('lesson_update')) &&
                                        <TableCell>Actions</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Lessons?.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, i) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>{row.lesson_title}</TableCell>
                                        <TableCell>{row.lesson_description.length > 50 ? row.lesson_description.slice(0, 50) + '...' : row.lesson_description}</TableCell>
                                        <TableCell>{row.lesson_status || "null"}</TableCell>
                                        <TableCell>
                                            {
                                                <>
                                                    {usersPermission.includes('lesson_update') &&
                                                        <IconButton style={{ color: "#2073c4" }} aria-label="edit" onClick={() => history.push(`/edit-leçon/${row.id}`)}>
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
                    <span>il n'y a pas de path</span>
                }
            </MainCard>
            <Grid item xs={12}>
                <Box display="flex" justifyContent="center" margin={"1rem"}>
                    <Button variant="outlined" color="primary" onClick={handleSubmit}>
                        Update Path
                    </Button>
                </Box>
            </Grid>
        </MainCard>
    );
};

export default EditCohort;
