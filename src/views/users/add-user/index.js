import React, { useState, useRef, useEffect } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { TextField, Button, Grid, MenuItem, InputAdornment } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import configData from '../../../config';
import TinyMce from '../../../ui-component/Tiny';

const AddUser = () => {
    const history = useHistory();
    const fileInputRef = useRef(null);
    const [socialMediaInputs, setSocialMediaInputs] = useState([{ socialMedia: '', link: '' }]);

    const handleChanges = (index, e) => {
        const { name, value } = e.target;
        const updatedInputs = [...socialMediaInputs];
        updatedInputs[index] = { ...updatedInputs[index], [name]: value };
        setSocialMediaInputs(updatedInputs);
        const updatedUser = { ...user };
        updatedUser.socials[index] = { socialMedia: updatedInputs[index].socialMedia, link: updatedInputs[index].link };
        setUser(updatedUser);
    };

    const handleDescription = (e) => {
        setUser({ ...user, description: e });
    };


    const handleAddInput = () => {
        setSocialMediaInputs([...socialMediaInputs, { socialMedia: '', link: '' }]);
    };

    const handleRemoveInput = (index) => {
        const updatedInputs = [...socialMediaInputs];
        updatedInputs.splice(index, 1);
        setSocialMediaInputs(updatedInputs);
        const updatedUser = { ...user };
        updatedUser.socials.splice(index, 1);
        setUser(updatedUser);
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
        birthday: 'dd/mm/yyy',
        post: '',
        photo: '',
        type: '',
        description: '',
        plan: 'null',
        cover_letter: 'null',
        etablissement: '',
        socials: []
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
                setRoles(res.data?.map((e) => e.role_name));
            })
            .catch((err) => {
                console.log(err?.response)
                setSnackbarMessage({ color: "red", msg: err?.response?.data.msg || err?.response?.data || err?.data.name || 'unkown error' });
                setSnackbarOpen(true);
                setTimeout(() => { handleSnackbarClose() }, 1500);
            });
    };

    const handleEditIconClick = () => {
        fileInputRef.current.click();
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setUser({ ...user, photo: file, file: file });
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

        // if (hasErrors) {
        //     setErrors(formErrors);
        //     setSnackbarMessage({ color: "red", msg: "Veuillez remplir tous les champs." });
        //     setSnackbarOpen(true);
        //     return;
        // }

        let Lantern = localStorage.getItem('Lantern-account')
        let tokenObj = JSON.parse(Lantern)
        let token = tokenObj.token

        // Create a new FormData object
        const formData = new FormData();

        var socialsArray = user.socials;

        var socialsJSON = JSON.stringify(socialsArray);

        formData.append('fullname', user.fullname);
        formData.append('phone', user.phone);
        formData.append('role_id', user.role_id);
        formData.append('email', user.email);
        formData.append('password', user.password);
        formData.append('birthday', user.birthday);
        formData.append('plan', user.plan);
        formData.append('cover_letter', user.cover_letter);
        formData.append('socials', socialsJSON);
        formData.append('photo', user.photo);
        formData.append('post', user.post);
        formData.append('etablissement', user.etablissement);
        formData.append('description', user.description);
        formData.append('cv', "null");


     
        axios.post(`${configData.API_SERVER}` + "users", formData, {
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
                    role_id: '',
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

    // useEffect(() => {
    //     getEstablishment();
    // }, []);

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
                        onChange={(event) => {
                            handleChange(event);
                        }}
                        error={errors.role_id}
                    >
                        {Roles?.map((role, i) => (
                            <MenuItem key={role} value={i + 1}>
                                {role}
                            </MenuItem>
                        ))}
                    </TextField>

                </Grid>

                {user.role_id && user.role_id == 3 &&
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            name="type"
                            label="type"
                            variant="outlined"
                            fullWidth
                            value={user.type}
                            onChange={(event) => {
                                handleChange(event);
                            }}
                            error={errors.type}
                        >
                            {["B2B", "B2C"]?.map((role, i) => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </TextField>

                    </Grid>}

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
                        type="date"
                        name="birthday"
                        variant="outlined"
                        label="Date de naissance"
                        fullWidth
                        value={user.birthday}
                        onChange={handleChange}
                        error={errors.birthday}
                    />
                </Grid>
                {/* {
                    user.role_id && user.role_id == 2 || user.role_id == 3 ?
                        <Grid item xs={12} sm={6}>
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
                } */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="photo"
                        label="Image"
                        variant="outlined"
                        fullWidth
                        value={user?.photo?.name}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment onClick={handleEditIconClick} position="end">
                                    <Button variant="contained" color="primary" component="span">
                                        Sélectionnez un fichier
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                        error={errors.photo}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </Grid>
                {
                    user.role_id && user.role_id == 2 ?
                        <>

                            <Grid item xs={12} sm={6}>
                                <TextField

                                    name="post"
                                    label="Poste Actuel"
                                    type="post"
                                    variant="outlined"
                                    fullWidth
                                    value={user.post || []}
                                    onChange={handleChange}
                                    error={errors.post}
                                    SelectProps={{
                                        multiple: true,
                                    }}
                                />
                            </Grid>

                            {socialMediaInputs?.map((input, index) => (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            name="socialMedia"
                                            label="Réseaux Sociaux"
                                            variant="outlined"
                                            fullWidth
                                            value={input.socialMedia}
                                            onChange={(e) => handleChanges(index, e)}
                                        >
                                            {[
                                                "Facebook",
                                                "Twitter",
                                                "Snapchat",
                                                "Tumblr",
                                                "Linkedin",
                                                "Viadeo",
                                                "Instagram",
                                                "Pinterest"
                                            ]?.map((role, i) => (
                                                <MenuItem key={role} value={role}>
                                                    {role}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            name="link"
                                            label="Lien du réseau social sélectionné"
                                            variant="outlined"
                                            fullWidth
                                            value={input.link}
                                            onChange={(e) => handleChanges(index, e)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2} style={{ display: "flex", alignItems: "center" }}>
                                        {index === socialMediaInputs.length - 1 && (
                                            <>
                                                <Button variant="outlined" color="primary" onClick={handleAddInput}>
                                                    +
                                                </Button>
                                                {socialMediaInputs.length > 1 && (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleRemoveInput(index)}
                                                        style={{ marginLeft: "8px" }}
                                                    >
                                                        -
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </Grid>
                                </>
                            ))}
                            <Grid item xs={12} sm={12}>
                                <TinyMce onData={handleDescription} />
                            </Grid>
                        </>
                        : null
                }
                <Grid item xs={12}>
                    <Button variant="outlined" color="primary" onClick={handleSubmit}>
                        Ajouter un utilisateur
                    </Button>
                </Grid>
            </Grid>
        </MainCard>
    );
};
const buttonStyle = {
    margin: '0 5px',
    padding: '7px 18px',
    fontSize: '12px',
    borderRadius: '5px',
    border: '2px solid #3f51b5',
    color: '#3f51b5',
    fontWeight: 'bold',
    transition: 'background-color 0.3s, color 0.3s',
    '&:hover': {
        backgroundColor: '#3f51b5',
        color: '#fff',
    },
};
export default AddUser;
