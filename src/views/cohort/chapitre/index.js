import React, { useState, useEffect } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { TextField, Button, Grid, MenuItem } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import InputAdornment from '@material-ui/core/InputAdornment';
import configData from '../../../config';
import { useParams } from 'react-router-dom';

const AddChapter = () => {
    const history = useHistory();
    const { id } = useParams();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [establishments, setEstablishments] = useState();

    const [user, setUser] = useState({

        name: '',

    });
    console.log(user);

    const [errors, setErrors] = useState({
        etablissement: false,
        users: false,
        instructors: false
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        let formErrors = {};
        let hasErrors = false;

        Object.keys(user).forEach((key) => {
            if (!user[key]) {
                formErrors[key] = true;
                hasErrors = true;
            } else {
                formErrors[key] = false;
            }
        });


        if (hasErrors) {
            setErrors(formErrors);
            setSnackbarMessage({ color: "red", msg: "Veuillez remplir tous les champs." });
            setSnackbarOpen(true);
            return;
        }

        let Lantern = localStorage.getItem('Lantern-account');
        let tokenObj = JSON.parse(Lantern);
        let token = tokenObj.token;
        const formData = {
            ...user,
            path_id: id
        };
        axios.post(`${configData.API_SERVER}` + "chapters", formData, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {
                setSnackbarMessage({ color: "green", msg: "Chapter added" });
                setSnackbarOpen(true);
                setTimeout(() => { handleSnackbarClose() }, 1500);

                setTimeout(() => { history.goBack() }, 2000);
            })
            .catch((err) => {
                const errorMessage = err.response ? err.response.data.msg || err.response.data : "An error occurred";
                console.log(err);
                setSnackbarMessage({ color: "red", msg: errorMessage });
                setSnackbarOpen(true);
                setTimeout(() => { handleSnackbarClose() }, 1500);
            });
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    const [timeValue, setTimeValue] = React.useState(false);

    return (
        <MainCard title="Affecter Utilisateurs">

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

                <Grid item xs={12} sm={12}>
                    <TextField
                        name="name"
                        label="Titre"
                        type="name"
                        variant="outlined"
                        fullWidth
                        value={user.name || []}
                        onChange={handleChange}
                        error={errors.name}
                        SelectProps={{
                            multiple: true,
                        }}
                    />

                </Grid>


                <Grid item xs={12}>
                    <Button variant="outlined" color="primary" onClick={handleSubmit}>
                        Affecter
                    </Button>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default AddChapter;
