import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, MenuItem, Snackbar, SnackbarContent } from '@material-ui/core';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import MainCard from '../../../ui-component/cards/MainCard';
import configData from '../../../config';

const EditUser = () => {
    const history = useHistory();
    const { id } = useParams();
    const [Roles, setRoles] = useState([]);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState({ color: '', msg: '' });
    const [user, setUser] = useState({
        fullname: '',
        email: '',
        phone: '',
        role_id: 0,
        birthday: '',

        createdAt: '',
        updatedAt: ''
    });

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        getRoles()
    }, [])
    const getRoles = () => {
        let Lantern = localStorage.getItem('Lantern-account')
        let tokenObj = JSON.parse(Lantern)
        let token = tokenObj.token
        axios.get(configData.API_SERVER + `roles`, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {
                setRoles(res.data.map((e) => e.role_name))
            })
            .catch((err) => {
                console.log(err?.response)
                setSnackbarMessage({ color: "red", msg: err?.response?.data.msg || err?.response?.data || err?.data.name || 'unkown error' }); // Set response data to display in the snackbar
                setSnackbarOpen(true); // Open the snackbar
                setTimeout(() => { handleSnackbarClose() }, 1500)
            })
    }

    const getUser = async () => {
        try {
            const token = JSON.parse(getToken());
            const res = await axios.get(configData.API_SERVER + `users/${id}`, {
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
        setUser({
            ...user, cover_letter: 'nulll',
            plan: 'nulll',
            cv: 'nulll', [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        try {
            console.log(user)
            const token = JSON.parse(getToken());
            await axios.put(configData.API_SERVER + `users/${id}`, user, {
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

    return (
        <MainCard title="Edit utilisateur">
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
                        name="fullname"
                        label="Nom & Prénom"
                        variant="outlined"
                        fullWidth
                        value={user.fullname}
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
                        label="Téléphone"
                        type='number'
                        variant="outlined"
                        fullWidth
                        value={user.phone}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="role_id"
                        select
                        label="Role"
                        variant="outlined"
                        fullWidth
                        value={user.role_id}
                        onChange={handleChange}
                    >
                        {Roles?.map((role, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                                {role}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="birthday"
                        label="birthday"
                        variant="outlined"
                        fullWidth
                        value={user.birthday}
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

                <Grid item xs={12}>
                    <Button variant="outlined" color="primary" onClick={handleSubmit}>
                        Edite utilisateur
                    </Button>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default EditUser;
