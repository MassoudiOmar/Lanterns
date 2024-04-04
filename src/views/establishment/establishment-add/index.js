import React, { useEffect, useRef, useState } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { TextField, Button, Grid, InputAdornment, Box } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import configData from '../../../config';

const ADDEtablissement = () => {
    const history = useHistory();
    const [timeValue, setTimeValue] = React.useState(false);
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);
    };

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [Roles, setRoles] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [errors, setErrors] = useState({
        name: false,
        description: false,
        image: false,
        email: false,
        phone: false,
        logo: null
    });

    const [user, setUser] = useState([
        {
            name: "",
            description: "",
            email: "",
            phone: "",
            image: ""
        }
    ])
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
                'Authorization': JSON.parse(token),
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


        if (hasErrors) {
            setErrors(formErrors);
            setSnackbarMessage({ color: "red", msg: "Veuillez remplir tous les champs." });
            setSnackbarOpen(true);
            return;
        }
        let formData = new FormData();
        Object.keys(user).forEach((key) => {
            formData.append(key, user[key]);
        });
        let Lantern = localStorage.getItem('Lantern-account')
        let tokenObj = JSON.parse(Lantern)
        let token = tokenObj.token
        axios.post(`http://localhost:3000/api/v1/establishments`, formData, {
            headers: {
                'Authorization': JSON.parse(token),

            }
        })
            .then((res) => {
                setSnackbarMessage({ color: "green", msg: "Etablissement ajouté" });
                setSnackbarOpen(true);
                setTimeout(() => { handleSnackbarClose() }, 1500);
                setUser({
                    name: "",
                    description: "",
                    email: "",
                    phone: "",
                    image: ""
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
    const handleFileChange = (e) => {
        const logo = e.target.files[0];
        if (logo) {
            setUser({ ...user, image: logo.name, logo: logo });
        }
    };
    const fileInputRef = useRef(null);

    const handleEditIconClick = () => {
        fileInputRef.current.click();
    };

    return (
        <MainCard title="Ajouter un Etablissement">
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
                        name="name"
                        label="Nom"
                        variant="outlined"
                        fullWidth
                        value={user.name}
                        onChange={handleChange}
                        error={errors.name}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="description"
                        label="Description"
                        variant="outlined"
                        fullWidth
                        value={user.description}
                        onChange={handleChange}
                        error={errors.description}
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
                        label="phone"
                        variant="outlined"
                        fullWidth
                        value={user.phone}
                        onChange={handleChange}
                        error={errors.phone}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        name="image"
                        label="Nom de la fichier"
                        variant="outlined"
                        fullWidth
                        error={errors.image}
                        value={user.image}
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
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </Grid>
                <Grid item xs={12} >
                    <Box display="flex" justifyContent="center" position="relative">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*,.pdf"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}

                        />
                        {user.logo ? (
                            <div>
                                <img
                                    src={URL.createObjectURL(user.logo)}
                                    alt="Selected Image"
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        borderRadius: 10,
                                        cursor: 'pointer',
                                    }}
                                />
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
                        Ajouter un Etablissement
                    </Button>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default ADDEtablissement;
