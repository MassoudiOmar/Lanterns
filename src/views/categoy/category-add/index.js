import React, { useState } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { TextField, Button, Grid, Box, MenuItem, Snackbar, SnackbarContent, InputAdornment } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import configData from '../../../config';

const AddCategory = () => {
    const history = useHistory();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState({ color: "", msg: "" });
    const [errors, setErrors] = useState({}); // State to manage form errors

    const [user, setUser] = useState({
        category_name: '',
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };


    const handleSubmit = () => {

        let Lantern = localStorage.getItem('Lantern-account');
        let tokenObj = JSON.parse(Lantern);
        let token = tokenObj.token;

        axios.post(configData.API_SERVER + `categories`, user, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {
                setSnackbarMessage({ color: "green", msg: "Categorie added" });
                setSnackbarOpen(true);
                setTimeout(() => { handleSnackbarClose() }, 1500);
                setUser({
                    category_name: '',

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

    return (
        <MainCard title="Ajouter un categorie">
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
                <Grid item xs={12} sm={12}>
                    <TextField
                        name="category_name"
                        label="Titre"
                        variant="outlined"
                        fullWidth
                        value={user.category_name}
                        onChange={handleChange}
                        error={errors.category_name} // Apply error style if true
                    />
                </Grid>



                <Grid item xs={12}>
                    <Button variant="outlined" color="primary" onClick={handleSubmit}>
                        Ajouter un categorie
                    </Button>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default AddCategory;
