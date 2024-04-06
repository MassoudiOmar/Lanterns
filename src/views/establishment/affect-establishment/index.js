import React, { useState, useEffect } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { TextField, Button, Grid, MenuItem } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import axios from 'axios'
import { useHistory, useParams } from 'react-router-dom';
import InputAdornment from '@material-ui/core/InputAdornment';
import configData from '../../../config';

const AffectEstablishment = () => {
    const history = useHistory();
    const { id } = useParams();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [users, setUsers] = useState();

    const [user, setUser] = useState({
        users: '',
    });
    console.log(user);

    const [errors, setErrors] = useState({
        users: false,
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

        axios.post(`${configData.API_SERVER}establishments/${id}/users`, user, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {
                setSnackbarMessage({ color: "green", msg: "Users added" });
                setSnackbarOpen(true);
                setTimeout(() => { handleSnackbarClose() }, 1500);
                setTimeout(() => { history.goBack() }, 2000);
            })
            .catch((err) => {
                const errorMessage = err.response ? err.response.data.msg || err.response.data : "An error occurred";
                setSnackbarMessage({ color: "red", msg: errorMessage });
                setSnackbarOpen(true);
                setTimeout(() => { handleSnackbarClose() }, 1500);
            });
    };


    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        try {

            let Lantern = localStorage.getItem('Lantern-account')
            let tokenObj = JSON.parse(Lantern)
            let token = tokenObj.token

            axios.get(configData.API_SERVER + 'users', {
                headers: {
                    'Authorization': JSON.parse(token)
                }
            })
                .then((res) => {
                    setUsers(res.data);
                })
                .catch((err) => {
                    console.log(err)
                });
        } catch (err) { console.log(err) }
    }


    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    return (
        <MainCard title="Affecter Establissment">

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
                        select
                        name="users"
                        label="Utilisateur(s)"
                        type="users"
                        variant="outlined"
                        fullWidth
                        value={user.users || []}
                        onChange={handleChange}
                        error={errors.users}
                        SelectProps={{
                            multiple: true,
                        }}
                    >
                        {users?.map((role, i) => (
                            <MenuItem key={role} value={i + 1}>
                                {role.fullname}
                            </MenuItem>))}
                    </TextField>
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

export default AffectEstablishment;
