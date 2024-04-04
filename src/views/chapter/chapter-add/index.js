import React, { useState, useEffect, useRef } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { TextField, Button, Grid, Box, MenuItem, Snackbar, SnackbarContent, InputAdornment } from '@material-ui/core';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import configData from '../../../config';

const AddChapter = () => {
    const history = useHistory();
    const { id } = useParams();

    const fileInputRef = useRef(null);
    const [hovered, setHovered] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState({ color: "", msg: "" });
    const [errors, setErrors] = useState({}); // State to manage form errors

    const [user, setUser] = useState({
        lesson_title: '',
        lesson_description: '',
        lesson_image: '',

        lesson_type: '',
        file: null
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUser({ ...user, lesson_image: file.name, file: file });
        }
    };

    const handleEditIconClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = () => {
        let formErrors = {};
        let hasErrors = false;

        // Check for empty fields
        Object.keys(user).forEach((key) => {
            if (!user[key]) {
                formErrors[key] = true;
                hasErrors = true;
            } else {
                formErrors[key] = false;
            }
        });

        if (!user.file) {
            formErrors['file'] = true;
            hasErrors = true;
        } else {
            formErrors['file'] = false;
        }

        if (hasErrors) {
            setErrors(formErrors);
            setSnackbarMessage({ color: "red", msg: "Veuillez remplir tous les champs." });
            setSnackbarOpen(true);
            return;
        }

        let Lantern = localStorage.getItem('Lantern-account');
        let tokenObj = JSON.parse(Lantern);
        let token = tokenObj.token;
        let data
        data = { ...user, path_id: id }
        axios.post(`${configData.API_SERVER}` + "lessons", data, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {
                setSnackbarMessage({ color: "green", msg: "Lesson added" });
                setSnackbarOpen(true);
                setTimeout(() => { handleSnackbarClose() }, 1500);
                setUser({
                    lesson_title: '',
                    lesson_description: '',
                    lesson_image: '',

                    lesson_type: '',
                    file: null
                });
                setTimeout(() => { history.goBack() }, 2000);
            })
            .catch((err) => {
                const errorMessage = err.response ? err.response.data.msg || err.response.data : "An error occurred";
                setSnackbarMessage({ color: "red", msg: errorMessage });
                setSnackbarOpen(true);
                setTimeout(() => { handleSnackbarClose() }, 1500);
            });
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    const [timeValue, setTimeValue] = React.useState(false);
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);
    };
    return (
        <MainCard title={`Ajouter un ${!timeValue ? 'leçon' : 'examen'}`} >
            <Grid item style={{ marginBottom: "1rem", }}>
                <Button
                    disableElevation
                    variant={timeValue ? 'contained' : 'string'}
                    size="small"
                    style={{ marginRight: "1rem" }}
                    onClick={(e) => handleChangeTime(e, true)}
                >
                    Examen
                </Button>
                <Button
                    disableElevation
                    variant={!timeValue ? 'contained' : 'string'}
                    size="small"
                    onClick={(e) => handleChangeTime(e, false)}
                >
                    Leçon
                </Button>
            </Grid>
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
                        name="lesson_title"
                        label="Titre"
                        variant="outlined"
                        fullWidth
                        value={user.lesson_title}
                        onChange={handleChange}
                        error={errors.lesson_title} // Apply error style if true
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="lesson_image"
                        label="Nom de la fichier"
                        variant="outlined"
                        fullWidth
                        error={errors.lesson_image}
                        value={user.lesson_image}
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
                        accept="image/*,video/*,.pdf"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        name="lesson_type"
                        label="type"
                        variant="outlined"
                        fullWidth
                        value={user.lesson_type}
                        onChange={handleChange}
                        error={errors.lesson_type} // Apply error style if true
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="lesson_description"
                        label="Description"
                        variant="outlined"
                        fullWidth

                        rows={4}
                        value={user.lesson_description}
                        onChange={handleChange}
                        error={errors.lesson_description} // Apply error style if true
                    />
                </Grid>
                {!timeValue && user?.file?.type?.startsWith('video/') && <Grid item xs={12} sm={12}>
                    <TextField
                        name="path_description"
                        label="Soutitrage (Optionnel)"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={user.path_description}
                        onChange={handleChange}
                        error={errors.path_description}
                    />
                </Grid>}
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

                            </div>
                        ) : (
                            <div>
                                <p>Aucun fichier sélectionné</p>
                            </div>
                        )}
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Button variant="outlined" color="primary" onClick={handleSubmit}>
                        Ajouter un {!timeValue ? 'leçon' : 'examen'}
                    </Button>
                </Grid>
            </Grid>
        </MainCard >
    );
};

export default AddChapter;
