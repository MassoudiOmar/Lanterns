import React, { useState, useRef, useEffect } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { TextField, Button, Grid, MenuItem } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import InputAdornment from '@material-ui/core/InputAdornment';
import configData from '../../../config';
import TinyMce from '../../../ui-component/Tiny';

const AddCohort = () => {
    const history = useHistory();
    const fileInputRef = useRef(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [Categories, setCategories] = useState([]);
    useEffect(() => {
        GetCategories()
    }, [])
    const GetCategories = async () => {
        try {
            let Lantern = localStorage.getItem('Lantern-account')
            let tokenObj = JSON.parse(Lantern)
            let token = tokenObj.token

            const response = await axios.get(configData.API_SERVER + `categories`, {
                headers: {
                    'Authorization': JSON.parse(token)
                }
            });
            setCategories(response.data);
        } catch (error) {
            setSnackbarMessage({ color: "red", msg: "Failed to fetch lesson" });
            setSnackbarOpen(true);
        }
    };
    const [user, setUser] = useState({
        path_name: '',
        path_description: '',
        path_image: '',
        path_price: '',
        category_id: '',
        file: ''
    });
    const handleDescription = (e) => {
        setUser({ ...user, path_description: e });
    };


    const [errors, setErrors] = useState({
        path_name: false,
        path_description: false,
        path_image: false,
        path_price: false,
        category_id: false
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleEditIconClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setUser({ ...user, path_image: file, file: file });
        } else {
            setSnackbarMessage({ color: "red", msg: "Veuillez sélectionner un fichier image." });
            setSnackbarOpen(true);
        }
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
        // Append data one by one
        let formData = new FormData();
        formData.append('path_name', user.path_name);
        formData.append('path_description', user.path_description);
        formData.append('path_image', user.file);
        formData.append('path_price', user.path_price);
        formData.append('category_id', user.category_id);
     

        let Lantern = localStorage.getItem('Lantern-account');
        let tokenObj = JSON.parse(Lantern);
        let token = tokenObj.token;
        console.log(user);
        axios.post(`${configData.API_SERVER}` + "paths", formData, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {
                setSnackbarMessage({ color: "green", msg: "Path added" });
                setSnackbarOpen(true);
                setTimeout(() => { handleSnackbarClose() }, 1500);
                setUser({
                    path_name: '',
                    path_description: '',
                    path_image: '',
                    path_price: '',
                    category_id: '',
                    file: null
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
        <MainCard title="Ajouter un path">
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
                        name="path_name"
                        label="Titre"
                        variant="outlined"
                        fullWidth
                        value={user.path_name}
                        onChange={handleChange}
                        error={errors.path_name}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="path_image"
                        label="Nom du fichier"
                        variant="outlined"
                        fullWidth
                        value={user.path_image.name}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment onClick={handleEditIconClick} position="end">
                                    <Button variant="contained" color="primary" component="span">
                                        Sélectionnez un fichier
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                        error={errors.path_image}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </Grid>


                <Grid item xs={12} sm={6}>
                    <TextField
                        name="path_price"
                        label="Prix"
                        variant="outlined"
                        fullWidth
                        value={user.path_price}
                        onChange={handleChange}
                        error={errors.path_price}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        name="category_id"
                        label="Catégorie"
                        variant="outlined"
                        fullWidth
                        value={user.category_id}
                        onChange={handleChange}
                        error={errors.category_id}
                    >
                        {Categories?.map((role, i) => (
                            <MenuItem key={role} value={i + 1}>
                                {role.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={12}>
                    <TinyMce onData={handleDescription} />
                </Grid>



                <Grid item xs={12}>
                    {user.file && (
                        <img
                            src={URL.createObjectURL(user.file)}
                            alt="Selected Image"
                            style={{
                                height: "100%",
                                width: "100%",
                                borderRadius: 10,
                                cursor: 'pointer',
                            }}
                        />
                    )}

                    {!user.file && (
                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                            <span style={{ fontSize: 16, color: '#888' }}>Aucune image sélectionnée</span>
                        </div>
                    )}

                </Grid>
                <Grid item xs={12}>
                    <Button variant="outlined" color="primary" onClick={handleSubmit}>
                        Ajouter un path
                    </Button>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default AddCohort;
