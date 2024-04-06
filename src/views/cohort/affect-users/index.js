import React, { useState, useEffect } from 'react';
import MainCard from '../../../ui-component/cards/MainCard';
import { TextField, Button, Grid, MenuItem } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import axios from 'axios'
import { useHistory, useParams } from 'react-router-dom';
import InputAdornment from '@material-ui/core/InputAdornment';
import configData from '../../../config';

const AffectUsers = () => {
    const history = useHistory();
    const { id } = useParams();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [establishments, setEstablishments] = useState();
    const [userss, setuserss] = useState();
    console.log(userss, "userr");

    const [user, setUser] = useState({
        etablissement: '',
        users: '',
        instructors: ''
    });

    const [errors, setErrors] = useState({
        etablissement: false,
        users: false,
        instructors: false
    });
    useEffect(() => {
        if (user.etablissement) {
            try {

                let Lantern = localStorage.getItem('Lantern-account')
                let tokenObj = JSON.parse(Lantern)
                let token = tokenObj.token

                axios.get(configData.API_SERVER + 'establishments/' + user.etablissement, {
                    headers: {
                        'Authorization': JSON.parse(token)
                    }
                })
                    .then((res) => {
                        setuserss(res.data);
                    })
                    .catch((err) => {
                        console.log(err)
                    });
            } catch (err) { console.log(err) }
        }
    }, [user])

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {


        let Lantern = localStorage.getItem('Lantern-account');
        let tokenObj = JSON.parse(Lantern);
        let token = tokenObj.token;

        axios.post(`${configData.API_SERVER}establishments/${user.etablissement}/users`, user, {
            headers: {
                'Authorization': JSON.parse(token)
            }
        })
            .then((res) => {
                setSnackbarMessage({ color: "green", msg: res.data.message });
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
        <MainCard title="Affecter Utilisateurs">
            <Grid item style={{ marginBottom: "1rem", }}>
                <Button
                    disableElevation
                    variant={timeValue ? 'contained' : 'string'}
                    size="small"
                    style={{ marginRight: "1rem" }}
                    onClick={(e) => handleChangeTime(e, true)}
                >
                    STUDENT
                </Button>
                <Button
                    disableElevation
                    variant={!timeValue ? 'contained' : 'string'}
                    size="small"
                    onClick={(e) => handleChangeTime(e, false)}
                >
                    INSTRUCTOR
                </Button>
            </Grid>
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
                        {userss?.users?.filter(user => user.role_id === 2).map((user, i) => (
                            <MenuItem key={user.id} value={i + 1}>
                                {user.fullname}
                            </MenuItem>
                        ))}

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
                            {userss?.users?.filter(user => user.role_id === 3).map((user, i) => (
                                <MenuItem key={user.id} value={i + 1}>
                                    {user.fullname}
                                </MenuItem>
                            ))}

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

export default AffectUsers;
