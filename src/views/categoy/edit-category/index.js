import React, { useState, useEffect } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { TextField, Button, Grid, Box } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import configData from '../../../config';

const EditChapter = () => {
    const { id } = useParams();
    const history = useHistory();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [lesson, setLesson] = useState({
        name: '',
        createdAt: '',
        updatedAt: ''
    });

    useEffect(() => {
        getLesson();
    }, []);

    const getLesson = async () => {
        try {
            let Lantern = localStorage.getItem('Lantern-account')
            let tokenObj = JSON.parse(Lantern)
            let token = tokenObj.token

            const response = await axios.get(configData.API_SERVER + `categories/${id}`, {
                headers: {
                    'Authorization': JSON.parse(token)
                }
            });
            setLesson(response.data);
            console.log(response.data)
        } catch (error) {
            setSnackbarMessage({ color: "red", msg: "Failed to fetch categorie" });
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
            let { name } = lesson
            let category_name = name
            let data = { category_name }


            const response = await axios.put(configData.API_SERVER + `categories/${id}`, data, {
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
                        name="name"
                        label="Titre"
                        variant="outlined"
                        fullWidth
                        value={lesson.name}
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
                    <Box display="flex" alignItems="center">
                        <Button variant="outlined" color="primary" onClick={handleSubmit}>
                            Edite Categorie
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default EditChapter;
