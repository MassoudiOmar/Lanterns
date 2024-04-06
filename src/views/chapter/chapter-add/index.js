import React, { useState, useEffect, useRef } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { TextField, Button, Grid, Box, MenuItem, Snackbar, SnackbarContent, InputAdornment } from '@material-ui/core';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import configData from '../../../config';
import TinyMce from '../../../ui-component/Tiny';
import Questionnaire from "../Questionnaire"

const AddChapter = () => {
    const history = useHistory();
    const { id } = useParams();

    const fileInputRef = useRef(null);
    const [hovered, setHovered] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState({ color: "", msg: "" });
    const [errors, setErrors] = useState({})

    const [user, setUser] = useState({
        lesson_title: '',
        lesson_description: null,
        lesson_image: '',
        duration: '',
        deadline: 'dd/mm/yyy',
        lesson_type: 'assignment',
        chapter_id: id,
        file: null
    });

    const handleDescription = (e) => {
        setUser({ ...user, lesson_description: e });
    };


    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUser({ ...user, lesson_image: file, file: file });
        }
    };

    const handleEditIconClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = () => {
        let formErrors = {};



        // let data = {};

        // switch (timeValue) {
        //     case "Leçon":
        //         data = { lesson_description: user?.lesson_description, duration: user?.duration, lesson_type: user?.lesson_type, lesson_image: user?.lesson_image, lesson_title: user.lesson_title, path_id: id };
        //         break;
        //     case "Examen":
        //         data = { deadline: user?.deadline, lesson_description: user?.lesson_description, duration: user?.duration, lesson_title: user.lesson_title, path_id: id };
        //         break;
        //     default:
        //         data = null;
        //         break;
        // }


        let Lantern = localStorage.getItem('Lantern-account');
        let tokenObj = JSON.parse(Lantern);
        let token = tokenObj.token;
        console.log(user);
        let data = { ...user, lesson_type: "assignment", path_id: id }

        axios.post(`${configData.API_SERVER}` + "lessons", user, {
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


    const [timeValue, setTimeValue] = React.useState('Leçon');
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);
    };
    return (
        <MainCard title={`Ajouter un ${!timeValue ? 'leçon' : 'examen'}`} >
            <Grid item >
                <Button
                    disableElevation
                    variant={timeValue === 'Leçon' ? 'contained' : 'outlined'}
                    style={{ margin: "0.5rem" }}
                    size="small"
                    onClick={(e) => handleChangeTime(e, 'Leçon')}
                >
                    Leçon
                </Button>
                <Button
                    disableElevation
                    variant={timeValue === 'Examen' ? 'contained' : 'outlined'}
                    size="small"
                    style={{ margin: "0.5rem" }}
                    onClick={(e) => handleChangeTime(e, 'Examen')}
                >
                    Examen
                </Button>

                <Button
                    disableElevation
                    variant={timeValue === 'Questionnaire' ? 'contained' : 'outlined'}
                    size="small"
                    style={{ margin: "0.5rem" }}

                    onClick={(e) => handleChangeTime(e, 'Questionnaire')}
                >
                    Quizz
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
            {
                timeValue === 'Leçon' ?
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
                                type="number"
                                name="duration"
                                label="Durée (en minutes)"
                                variant="outlined"
                                fullWidth
                                value={user.duration}
                                onChange={handleChange}
                                error={errors.duration}
                                InputProps={{
                                    inputProps: { min: 0 } // Set minimum value to 0
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                name="socialMedia"
                                label="Type"
                                variant="outlined"
                                fullWidth
                                value={user.socialMedia}
                                onChange={(event) => {
                                    handleChange(event);
                                }}
                            >
                                {[
                                    "Text",
                                    "Video",
                                    "PDF"
                                ].map((role, i) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="lesson_image"
                                label="Nom de la fichier"
                                variant="outlined"
                                fullWidth
                                error={errors.lesson_image}
                                value={user.lesson_image.name}
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


                        <Grid item xs={12} sm={12}>
                            <TinyMce onData={handleDescription} />
                        </Grid>
                        {user?.file?.type?.startsWith('video/') && <Grid item xs={12} sm={12}>
                            <TextField
                                name="path_description"
                                label="Soutitrage (Optionnel)"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={user.Soutitrage}
                                onChange={handleChange}
                                error={errors.path_description}
                            />
                        </Grid>}
                        <Grid item xs={12} sm={12}>
                            <Box display="flex" justifyContent="center" position="relative">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/*,.pdf"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}

                                />
                                {user.file ? (
                                    <div style={{ width: "100%" }}>
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
                                                width={"100%"}
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
                                Ajouter un leçon
                            </Button>
                        </Grid>
                    </Grid>
                    :
                    timeValue === 'Examen' ?

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
                                    type="number"
                                    name="duration"
                                    label="Durée (en minutes)"
                                    variant="outlined"
                                    fullWidth
                                    value={user.duration}
                                    onChange={handleChange}
                                    error={errors.duration}
                                    InputProps={{
                                        inputProps: { min: 0 } // Set minimum value to 0
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <TextField
                                    type="date"
                                    name="deadline"
                                    label="Date limite"
                                    variant="outlined"
                                    fullWidth
                                    value={user.deadline}
                                    onChange={handleChange}
                                    error={errors.deadline}

                                />

                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TinyMce onData={handleDescription} />
                            </Grid>
                            {user?.file?.type?.startsWith('video/') && <Grid item xs={12} sm={12}>
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
                                <Button variant="outlined" color="primary" onClick={handleSubmit}>
                                    Ajouter un examen
                                </Button>
                            </Grid>
                        </Grid>
                        :
                        timeValue === 'Questionnaire' ?

                            <Questionnaire />
                            : null
            }
        </MainCard >
    );
};

export default AddChapter;
