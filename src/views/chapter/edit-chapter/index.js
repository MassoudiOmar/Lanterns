import React, { useState, useRef, useEffect } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { TextField, Button, Grid, Box, IconButton } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import configData from '../../../config';

const EditChapter = () => {
    const { id } = useParams();
    const history = useHistory();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [hovered, setHovered] = useState(false);
    const fileInputRef = useRef(null);

    const [lesson, setLesson] = useState({
        lesson_title: '',
        creator_name: '',
        lesson_description: '',
        lesson_image: '',
        lesson_price: '10',
        createdAt: '',
        updatedAt: ''
    });
    /*
     "id": 1,
  "lesson_title": "test1",
  "lesson_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam facilisis lacus a urna tincidunt consequat. Duis eleifend ligula lectus, eget auctor magna consectetur nec. Maecenas posuere diam a dui varius dignissim. Nam efficitur vitae urna eget suscipit. ",
  "lesson_image": null,
  "lesson_video": null,
  "lesson_files": null,
  "lesson_text": null,
  "lesson_type": null,
  "lesson_status": "Lesson created, status Done",
  "path_id": 45,
  "creator_id": 1,
  "creator_name": "Admin",
    */

    useEffect(() => {
        getLesson();
    }, []);

    const getLesson = async () => {
        try {
            let Lantern = localStorage.getItem('Lantern-account')
            let tokenObj = JSON.parse(Lantern)
            let token = tokenObj.token

            const response = await axios.get(`${configData.API_SERVER}lessons/${id}`, {
                headers: {
                    'Authorization': JSON.parse(token)
                }
            });
            setLesson(response.data);
        } catch (error) {
            setSnackbarMessage({ color: "red", msg: "Failed to fetch lesson" });
            setSnackbarOpen(true);
        }
    };

    const handleChange = (e) => {
        setLesson({ ...lesson, [e.target.name]: e.target.value });
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
        <MainCard title="Edit Leçon">

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
                <Grid item sm={6} xs={12}>
                    <TextField
                        name="lesson_title"
                        label="Titre"
                        variant="outlined"
                        fullWidth
                        value={lesson.lesson_title}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item sm={6} xs={12}>
                    <TextField
                        name="creator_namee"
                        label="Nom de createur"
                        variant="outlined"
                        fullWidth
                        value={lesson.creator_name}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="lesson_description"
                        label="Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={lesson.lesson_description}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="createdAt"
                        label="Created At"
                        variant="outlined"
                        fullWidth
                        disabled
                        value={lesson.createdAt}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="updatedAt"
                        label="Updated At"
                        variant="outlined"
                        fullWidth
                        disabled
                        value={lesson.updatedAt}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" alignItems="center" position="relative">
                        <img
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                            style={{
                                maxWidth: "100%",
                                height: "auto",
                                borderRadius: 10,
                                opacity: 1
                            }}
                            alt="Chapter Image"
                            src={lesson?.lesson_image?.includes('http') ? lesson?.lesson_image : "https://capitalizemytitle.com/wp-content/uploads/2022/06/AI_BookChapters.jpg"}
                        />
                        {hovered && (
                            <IconButton
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                                onClick={handleEditIconClick}
                                style={{ position: 'absolute', top: 10, right: 10, backgroundColor: "#fff" }}>
                                <EditIcon />
                            </IconButton>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <Button variant="outlined" color="primary" onClick={handleSubmit}>
                            Edite Leçon
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default EditChapter;
