import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, MenuItem, Snackbar, SnackbarContent } from '@material-ui/core';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import MainCard from '../../../ui-component/cards/MainCard';
import configData from '../../../config';
import TinyMce from '../../../ui-component/Tiny';

const EditUser = () => {
    const history = useHistory();
    const { id } = useParams();
    const [Roles, setRoles] = useState([]);
    const [socialMediaInputs, setSocialMediaInputs] = useState([]);
    console.log(socialMediaInputs, "here");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState({ color: '', msg: '' });
    const [user, setUser] = useState({
        fullname: '',
        email: '',
        phone: '',
        role_id: 0,
        birthday: '',

        description: '',
        socials: '',
        post: '',

        createdAt: '',
        updatedAt: ''
    });
    const handleDescription = (e) => {
        setUser({ ...user, description: e });
    };
    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        getRoles()
    }, [])

    const handleChanges = (index, e) => {
        const { name, value } = e.target;
        const updatedInputs = [...socialMediaInputs];
        updatedInputs[index] = { ...updatedInputs[index], [name]: value };
        setSocialMediaInputs(updatedInputs);
        const updatedUser = { ...user };
        updatedUser.socials[index] = { socialMedia: updatedInputs[index].socialMedia, link: updatedInputs[index].link };
        setUser(updatedUser);
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
            console.log(res.data.socials, "red");
            setUser(res.data);
            let resDataSocials = JSON.parse(res.data.socials)
            setSocialMediaInputs(resDataSocials);
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
                {user.post && <Grid item xs={12} sm={6}>
                    <TextField
                        name="post"
                        label="Post Actuel"
                        type='text'
                        variant="outlined"
                        fullWidth
                        value={user.post}
                        onChange={handleChange}
                    />
                </Grid>}
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
                <Grid item xs={12} sm={12}>
                    <TextField
                        type="date"
                        name="birthday"
                        variant="outlined"
                        label="Date de naissance"
                        fullWidth
                        value={user.birthday}
                        onChange={handleChange}

                    />
                </Grid>

                {/* {user.socials && socialMediaInputs?.map((input, index) => (
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
                                    {/* <Button variant="outlined" color="primary" onClick={handleAddInput}>
                                        +
                                    </Button> */}
                {/* {socialMediaInputs.length > 1 && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleRemoveInput(index)}
                                            style={{ marginLeft: "8px" }}
                                        >
                                            -
                                        </Button>
                         
                      
                )) */}
                {user.description && <Grid item xs={12} sm={12}>
                    <TinyMce onData={handleDescription} data={user.description} />
                </Grid>}
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
