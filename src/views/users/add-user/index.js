import React, { useEffect, useState } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { TextField, Button, Grid, MenuItem } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import configData from '../../../config';

const AddUser = () => {
    const history = useHistory();
    const [timeValue, setTimeValue] = React.useState(false);
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);
    };

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [Establishments, setEstablishments] = useState(false);
    const [Roles, setRoles] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [errors, setErrors] = useState({
        fullname: false,
        email: false,
        phone: false,
        role_id: false,
        password: false,
        birthday: false,
        plan: false,
        cover_letter: false,
    });

    const [user, setUser] = useState({
        fullname: '',
        phone: '',
        role_id: '',
        email: '',
        password: '',
        birthday: '',
        plan: 'null',
        cover_letter: 'null',
        etablissement: '',

    });


    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        getRoles();
    }, []);

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
                setRoles(res.data.map((e) => e.role_name));
            })
            .catch((err) => {
                console.log(err?.response)
                setSnackbarMessage({ color: "red", msg: err?.response?.data.msg || err?.response?.data || err?.data.name || 'unkown error' });
                setSnackbarOpen(true);
                setTimeout(() => { handleSnackbarClose() }, 1500);
            });
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
        console.log(user)

        if (hasErrors) {
            setErrors(formErrors);
            setSnackbarMessage({ color: "red", msg: "Veuillez remplir tous les champs." });
            setSnackbarOpen(true);
            return;
        }

        let Lantern = localStorage.getItem('Lantern-account')
        let tokenObj = JSON.parse(Lantern)
        let token = tokenObj.token
        axios.post(`http://localhost:3000/api/v1/users`, user, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {
                setSnackbarMessage({ color: "green", msg: "Utilisateur ajouté" });
                setSnackbarOpen(true);
                setTimeout(() => { handleSnackbarClose() }, 1500);
                setUser({
                    fullname: '',
                    phone: '',
                    role_id: 0,
                    email: '',
                    password: '',
                    birthday: '',
                    plan: '',
                    cover_letter: '',
                    etablissement: ''
                });
                setTimeout(() => { history.goBack() }, 2000);

            })
            .catch((err) => {
                console.log(err.response);
                setSnackbarMessage({ color: "red", msg: err?.response?.data?.msg || "L'email existe déjà" });
                setSnackbarOpen(true);
                setTimeout(() => { handleSnackbarClose() }, 1500);
            });
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
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
                    if (err.response.data.message == 'Forbidden') {
                        console.log(err)
                    }
                });
        } catch (err) { console.log(err) }
    }


    return (
        <MainCard title="Ajouter un utilisateur">
            {/* <Grid item style={{ marginBottom: "1rem", }}>
                <Button
                    disableElevation
                    variant={timeValue ? 'contained' : 'string'}
                    size="small"
                    style={{ marginRight: "1rem" }}
                    onClick={(e) => handleChangeTime(e, true)}
                >
                    AUTRE
                </Button>
                <Button
                    disableElevation
                    variant={!timeValue ? 'contained' : 'string'}
                    size="small"
                    onClick={(e) => handleChangeTime(e, false)}
                >
                    ETUDIANT(e)
                </Button>
            </Grid> */}
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
                        error={errors.fullname}
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
                        error={errors.email}
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
                        error={errors.phone}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        name="role_id"
                        label="Role"
                        variant="outlined"
                        fullWidth
                        value={user.role_id}
                        onChange={handleChange}
                        error={errors.role_id}
                    >
                        {Roles?.map((role, i) => (
                            <MenuItem key={role} value={i + 1}>
                                {role}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        name="password"
                        label="Mot de passe"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={user.password}
                        onChange={handleChange}
                        error={errors.password}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="birthday"
                        label="Date de naissance"
                        type="birthday"
                        variant="outlined"
                        fullWidth
                        value={user.birthday}
                        onChange={handleChange}
                        error={errors.birthday}
                    />
                </Grid>
                {
                    user.role_id && user.role_id == 2 || user.role_id == 3 ?
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
                                SelectProps={{
                                    multiple: true,
                                }}
                            >
                                {Establishments?.map((role, i) => (
                                    <MenuItem key={role} value={i + 1}>
                                        {role.name}
                                    </MenuItem>))}
                            </TextField>
                        </Grid> : null
                }
                {/* {!timeValue &&
                    <>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="plan"
                                label="plan"
                                type="plan"
                                variant="outlined"
                                fullWidth
                                value={user.plan}
                                onChange={handleChange}
                                error={errors.plan}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="cover_letter"
                                label="cover_letter"
                                type="cover_letter"
                                variant="outlined"
                                fullWidth
                                value={user.cover_letter}
                                onChange={handleChange}
                                error={errors.cover_letter}
                            />
                        </Grid>
                    </>

                } */}
                <Grid item xs={12}>
                    <Button variant="outlined" color="primary" onClick={handleSubmit}>
                        Ajouter un utilisateur
                    </Button>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default AddUser;
