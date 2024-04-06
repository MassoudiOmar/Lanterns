import React, { useState, useRef, useEffect } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { TableContainer, Box, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Paper, TextField, Button, Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid } from '@material-ui/core';
import Skeleton from '@material-ui/core/Skeleton';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { gridSpacing } from '../../../store/constant';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import configData from '../../../config';

const EditChapter = () => {
    const { id } = useParams();
    const history = useHistory();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const fileInputRef = useRef(null);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([{
        lesson_title: '',
        lesson_description: null,
        lesson_image: '',
        duration: '',
        deadline: 'dd/mm/yyy',
        lesson_type: 'assignment',
        chapter_id: id,
        file: null
    }
    ]);
    const [usersPermission, setUsersPermission] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState(null);
    const [lesson, setLesson] = useState();
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (userId) => {
        setUserToDeleteId(userId); // Set the ID of the user to be deleted
        setDeleteDialogOpen(true); // Open the delete confirmation dialog
    };
    const handleDeleteConfirmation = () => {
        let Lantern = localStorage.getItem('Lantern-account')
        let tokenObj = JSON.parse(Lantern)
        let token = tokenObj.token

        axios.delete(`${configData.API_SERVER}lessons/${userToDeleteId}`, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {

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

    useEffect(() => {
        applyFilters();
    }, [users, searchTerm]);

    const applyFilters = () => {
        const filtered = users.filter(user =>
            lesson?.lesson_title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    };


    useEffect(() => {
        getLesson();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const getLesson = async () => {
        try {
            let Lantern = localStorage.getItem('Lantern-account')
            let tokenObj = JSON.parse(Lantern)
            let token = tokenObj.token

            const response = await axios.get(`${configData.API_SERVER}chapters/${1}/lessons`, {
                headers: {
                    'Authorization': JSON.parse(token)
                }
            });
            console.log(response.data);
            setLesson(response.data);
        } catch (error) {
            setSnackbarMessage({ color: "red", msg: "Failed to fetch lesson" });
            setSnackbarOpen(true);
        }
    };

    const handleChange = (e) => {
        setLesson({ ...lesson, [e.target.name]: e.target.value });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    const handleSubmit = async () => {
        try {
            const tokenObj = JSON.parse(localStorage.getItem('Lantern-account'));
            const token = tokenObj.token;
            let { lesson_description, lesson_image, lesson_title, lesson_price } = lesson
            let data = { lesson_description, lesson_image: '123', lesson_title, lesson_price: 10 }

            const response = await axios.put(`${configData.API_SERVER}lessons/${id}`, data, {
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLesson({ ...lesson, Chapter_image: URL.createObjectURL(file) });
        }
    };

    const handleEditIconClick = () => {
        fileInputRef.current.click();
    };

    return (
        <MainCard title="Edit Chapitre">

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
                <Grid item sm={12} xs={12}>
                    <TextField
                        name="lesson_title"
                        label="Titre"
                        variant="outlined"
                        fullWidth
                        value={lesson?.lesson_title}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} marginBottom={2}>
                    <Box display="flex" justifyContent="left" alignItems="center">
                        <Button variant="outlined" color="primary" onClick={handleSubmit}>
                            Edite Chapitre
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <MainCard title="Leçons">
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
                            Êtes-vous sûr de vouloir supprimer cet leçon ?
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
                {usersPermission.includes('lesson_add') &&
                    <Grid container justifyContent="flex-end" item xs={12} onClick={() => history.push(`/ajoute-chapitre`)}>
                        <Button variant="outlined" color="primary">
                            Ajouter un leçons
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

                {lesson?.length ?
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
                                {filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, i) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>{row?.lesson_title}</TableCell>
                                        <TableCell>{row?.lesson_description.length > 50 ? row.lesson_description.slice(0, 50) + '...' : row.lesson_description}</TableCell>
                                        <TableCell>{row?.lesson_status || "null"}</TableCell>
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
                    <span style={{ width: "100%", margin: 5 }}>

                        No data
                    </span>
                }


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

        </MainCard>
    );
};

export default EditChapter;
