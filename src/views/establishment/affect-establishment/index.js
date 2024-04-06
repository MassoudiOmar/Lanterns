import React, { useState, useEffect } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { TextField, Button, Grid, MenuItem } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import InputAdornment from '@material-ui/core/InputAdornment';
import configData from '../../../config';

const AffectEstablishment = () => {
    const history = useHistory();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [establishments, setEstablishments] = useState();

    const [user, setUser] = useState({
        etablissement: '',
        users: '',
        instructors: ''
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

        // axios.post(`${configData.API_SERVER}paths`, user, {
        //     headers: {
        //         'Authorization': JSON.parse(token)
        //     }
        // })
        //     .then((res) => {
        //         setSnackbarMessage({ color: "green", msg: "Path added" });
        //         setSnackbarOpen(true);
        //         setTimeout(() => { handleSnackbarClose() }, 1500);
        //         setUser({
        //             path_name: '',
        //             path_description: '',
        //             path_image: '',
        //             path_price: '',
        //             category_id: '',
        //             file: null
        //         });
        //         setTimeout(() => { history.goBack() }, 2000);
        //     })
        //     .catch((err) => {
        //         const errorMessage = err.response ? err.response.data.msg || err.response.data : "An error occurred";
        //         setSnackbarMessage({ color: "red", msg: errorMessage });
        //         setSnackbarOpen(true);
        //         setTimeout(() => { handleSnackbarClose() }, 1500);
        //     });
    };


    useEffect(() => {
        getEstablishment();
    }, []);

    const getEstablishment = () => {
        try {

            let Lantern = localStorage.getItem('Lantern-account')
            let tokenObj = JSON.parse(Lantern)
            let token = tokenObj.token

            axios.get(configData.API_SERVER + 'establishments', {
                headers: {
                    'Authorization': JSON.parse(token)
                }
            })
                .then((res) => {
                    setEstablishments(res.data);
                })
                .catch((err) => {
                    console.log(err)
                });
        } catch (err) { console.log(err) }
    }


    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    const [timeValue, setTimeValue] = React.useState(false);
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);
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
                        name="etablissement"
                        label="Etablissement"
                        type="etablissement"
                        variant="outlined"
                        fullWidth
                        value={user.etablissement || []}
                        onChange={handleChange}
                        error={errors.etablissement}

                    >
                        {establishments?.map((role, i) => (
                            <MenuItem key={role} value={i + 1}>
                                {role.name}
                            </MenuItem>))}
                    </TextField>
                </Grid>

                {!timeValue ? <Grid item xs={12} sm={12}>
                    <TextField
                        select
                        name="users"
                        label="Instructor(s)"
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
                        {[`etablissement ${user.etablissement}'s Instructor`, `etablissement ${user.etablissement}'s Instructor`, `etablissement ${user.etablissement}'s Instructor`, `etablissement ${user.etablissement}'s Instructor`, `etablissement ${user.etablissement}'s Instructor`,]?.map((role, i) => (
                            <MenuItem key={role} value={i + 1}>
                                {role}
                            </MenuItem>))}
                    </TextField>
                </Grid> :
                    <Grid item xs={12} sm={12}>
                        <TextField
                            select
                            name="instructors"
                            label="Utilisateur(s)"
                            type="instructors"
                            variant="outlined"
                            fullWidth
                            value={user.instructors || []}
                            onChange={handleChange}
                            error={errors.instructors}
                            SelectProps={{
                                multiple: true,
                            }}
                        >
                            {[`etablissement ${user.etablissement}'s student`, `etablissement ${user.etablissement}'s student`, `etablissement ${user.etablissement}'s student`, `etablissement ${user.etablissement}'s student`, `etablissement ${user.etablissement}'s student`,]?.map((role, i) => (
                                <MenuItem key={role} value={i + 1}>
                                    {role}
                                </MenuItem>))}
                        </TextField>
                    </Grid>
                }

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
