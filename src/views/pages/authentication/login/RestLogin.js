import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import configData from '../../../../config';

// material-ui
import { makeStyles } from '@material-ui/styles';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@material-ui/core';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'

// project imports
import useScriptRef from '../../../../hooks/useScriptRef';
import AnimateButton from '../../../../ui-component/extended/AnimateButton';
import { ACCOUNT_INITIALIZE, SET_VARIABLE } from './../../../../store/actions';

// assets
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

// style constant
const useStyles = makeStyles((theme) => ({
    redButton: {
        fontSize: '1rem',
        fontWeight: 500,
        backgroundColor: theme.palette.grey[50],
        border: '1px solid',
        borderColor: theme.palette.grey[100],
        color: theme.palette.grey[700],
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.primary.light
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.875rem'
        }
    },
    signDivider: {
        flexGrow: 1
    },
    signText: {
        cursor: 'unset',
        margin: theme.spacing(2),
        padding: '5px 56px',
        borderColor: theme.palette.grey[100] + ' !important',
        color: theme.palette.grey[900] + '!important',
        fontWeight: 500
    },
    loginIcon: {
        marginRight: '16px',
        [theme.breakpoints.down('sm')]: {
            marginRight: '8px'
        }
    },
    loginInput: {
        ...theme.typography.customInput
    }
}));

//============================|| API JWT - LOGIN ||============================//

const RestLogin = (props, { ...others }) => {
    const classes = useStyles();
    const dispatcher = useDispatch();

    const scriptedRef = useScriptRef();
    const [checked, setChecked] = React.useState(true);

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email requis'),
                    password: Yup.string().max(255).required('Mot de passe requis')
                })}
                onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                    //  try {
                    axios
                        .post(configData.API_SERVER + 'auth/signin', {
                            password: values.password,
                            email: values.email
                        })
                        .then(function (response) {
                            if (response.data.success) {
                                const user = jwtDecode(response.data.token);
                                if (user.role_id == 1 || user.role_id == 2) {
                                    axios.get(configData.API_SERVER + `roles/${user.role_id}`, {
                                        headers: {
                                            'Authorization': response.data.token
                                        }
                                    })
                                        .then((res) => {
                                            const { data: responseData } = response;
                                            const { token } = responseData;

                                            const { role_id: roleId, fullname } = user;

                                            const permissions = res?.data?.permissions?.map(permission => permission?.perm_name);
                                            dispatcher({ type: SET_VARIABLE, variable: permissions });
                                            dispatcher({
                                                type: ACCOUNT_INITIALIZE,
                                                payload: {
                                                    token,
                                                    role: roleId,
                                                    fullname,
                                                    perm: permissions,
                                                    isLoggedIn: true
                                                }
                                            });
                                        })
                                        .catch((err) => console.log(err))

                                } else {
                                    setErrors({ submit: 'Not Allowed!' });

                                }

                                if (scriptedRef.current) {
                                    setStatus({ success: true });
                                    setSubmitting(false);
                                }
                            } else { console.log("first") }
                        })
                        .catch(function (error) {
                            console.log(error)
                            setStatus({ success: false });
                            setErrors({ submit: error?.response?.data.message || error?.response?.data.msg });
                            setSubmitting(false);
                        });
                    // } catch (err) {
                    //     console.error(err);
                    //     if (scriptedRef.current) {
                    //         setStatus({ success: false });
                    //         setErrors({ submit:  error.response.data.msg});
                    //         setSubmitting(false);
                    //     }
                    // }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} className={classes.loginInput}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Adresse e-mail / Nom d`utilisateur</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email Address"
                                inputProps={{
                                    classes: {
                                        notchedOutline: classes.notchedOutline
                                    }
                                }}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {' '}
                                    {errors.email}{' '}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.password && errors.password)} className={classes.loginInput}>
                            <InputLabel htmlFor="outlined-adornment-password-login">Mot de passe</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                inputProps={{
                                    classes: {
                                        notchedOutline: classes.notchedOutline
                                    }
                                }}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {' '}
                                    {errors.password}{' '}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(event) => setChecked(event.target.checked)}
                                        name="checked"
                                        color="primary"
                                    />
                                }
                                label="Souviens-toi de moi"
                            />
                            <Typography
                                variant="subtitle1"
                                component={Link}
                                to={props.login ? '/pages/forgot-password/forgot-password' + props.login : '#'}
                                color="secondary"
                                sx={{ textDecoration: 'none' }}
                            >
                                Mot de passe oublié?
                            </Typography>
                        </Stack>
                        {errors.submit && (
                            <Box
                                sx={{
                                    mt: 3
                                }}
                            >
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box
                            sx={{
                                mt: 2
                            }}
                        >
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Se connecter
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </React.Fragment>
    );
};

export default RestLogin;
