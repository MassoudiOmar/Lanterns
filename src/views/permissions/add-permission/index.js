import React, { useState } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { TextField, Button, Grid, MenuItem } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import configData from '../../../config';

const AddUser = () => {
    const history = useHistory();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [user, setUser] = useState({
        role_name: '',
        role_description: '',
    });

    const [errors, setErrors] = useState({
        role_name: false,
        role_description: false,
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        // Check if any input field is empty
        if (!user.role_name || !user.role_description) {
            // If any field is empty, set errors
            setErrors({
                role_name: !user.role_name,
                role_description: !user.role_description,
            });
            setSnackbarMessage({ color: "red", msg: "Veuillez remplir tous les champs." });
            setSnackbarOpen(true);
            return; // Exit the function
        }

        let Lantern = localStorage.getItem('Lantern-account')
        let tokenObj = JSON.parse(Lantern)
        let token = tokenObj.token
        axios.post(configData.API_SERVER + `roles`, user, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {
                setSnackbarMessage({ color: "green", msg: "role added" });
                setSnackbarOpen(true);
                setTimeout(() => { handleSnackbarClose() }, 1500);
                setUser({
                    role_name: '',
                    role_description: '',
                });
                setTimeout(() => { history.goBack() }, 2000);
            })
            .catch((err) => {
                console.log(err.response);
                setSnackbarMessage({ color: "red", msg: err.response.data.msg || err.response.data || "l'email existe déjà" });
                setSnackbarOpen(true);
                setTimeout(() => { handleSnackbarClose() }, 1500);
            });
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <MainCard title="Ajouter un role">
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
                        name="role_name"
                        label="Nom"
                        variant="outlined"
                        fullWidth
                        value={user.role_name}
                        onChange={handleChange}
                        error={errors.role_name} // Add error prop to highlight in red
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="role_description"
                        label="Description"
                        variant="outlined"
                        fullWidth
                        value={user.role_description}
                        onChange={handleChange}
                        error={errors.role_description} // Add error prop to highlight in red
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="outlined" color="primary" onClick={handleSubmit}>
                        Ajouter un role
                    </Button>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default AddUser;
