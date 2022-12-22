import React, { useState } from 'react';

//ui packages
import { Container, Avatar, Paper, Grid, Typography, Button } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

// pakages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//style
import useStyles from './Styles';

// components
import InputField from './InputField';
import Icon from './icon';
import { signin, signup } from '../../actions/Auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', comfirmPassword: '' }

const Auth = () => {
    const [formData, setFormData] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // show password and hiden password
    const handlePasswordShow = () => setShowPassword((prvShowPassword) => !prvShowPassword);

    /**
     * sign In and sign up user dispatch
     * @param {object} event 
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        if (isSignUp) {
            dispatch(signup(formData, navigate));
        } else {
            dispatch(signin(formData, navigate));
        };
    };

    /**
     * handle onchange input value in formData
     * @param {object} event 
     */
    const handleOnChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    };

    /**
     * switch Mode onclick button move to sign in or sign up page
     */
    const switchMode = () => {
        setIsSignUp((prvIssignUp) => !prvIssignUp);
        setShowPassword(false);
    };

    /**
     * google auth res data success 
     * @param {object} res 
     */
    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;
        try {
            dispatch({ type: "AUTH", data: { result, token } });
            navigate("/")
            toast.success("Sign In successfuly ", {
                position: "bottom-right",
            });
        } catch ({
            // Destructuring
            data: {
                error: { message = "" },
            },
        }) {
            toast.error(message, {
                type: "error",
                data: message,
                position: "bottom-right",
            });
        }
    };

    const googleFaliure = () => {
        toast.error('Google Sign In was unsuccessful. Try again later', {
            position: "bottom-right"
        });
    };


    return (
        <>
            <Container component="main" maxWidth="xs">
                <Paper className={classes.paper} elevation={3}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography variant='h5'>{isSignUp ? "Sign Up" : "Sign In"}</Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {
                                isSignUp && (
                                    <>
                                        <InputField
                                            name="firstName"
                                            label='FirstName'
                                            handleOnChange={handleOnChange}
                                            autoFocus
                                            half
                                        />
                                        <InputField
                                            name="lastName"
                                            label='LastName'
                                            handleOnChange={handleOnChange}
                                            autoFocus
                                            half
                                        />
                                    </>
                                )}
                            <InputField
                                name='email'
                                label='Email Address'
                                handleOnChange={handleOnChange}
                                type="email"
                            />
                            <InputField
                                name='password'
                                label='Password'
                                handleOnChange={handleOnChange}
                                type={showPassword ? 'text' : 'password'}
                                handlePasswordShow={handlePasswordShow}
                            />
                            {
                                isSignUp && <InputField name='confirmPassword' label="Repeat Password" handleOnChange={handleOnChange} type='password' />
                            }
                        </Grid>
                        <Button fullWidth type='submit' variant='contained' color='primary' className={classes.submit}>{isSignUp ? 'Sign Up' : 'sign In'}</Button>
                        {/* Google sign in Button */}
                        <GoogleLogin
                            clientId="968502154569-8s1u0kkg5064onsq180f5s5bqln3htsp.apps.googleusercontent.com"
                            render={(renderPrpos) => (
                                <Button
                                    className={classes.googleButton}
                                    color='primary'
                                    fullWidth
                                    onClick={renderPrpos.onClick}
                                    disabled={renderPrpos.disabled}
                                    startIcon={<Icon />}
                                    variant='contained'
                                >
                                    Google Sign In
                                </Button>
                            )}
                            onSuccess={googleSuccess}
                            onFailure={googleFaliure}
                            cookiePolicy={'single_host_origin'}
                        />

                        <Grid container justify='flex-end'>
                            <Grid item>
                                {/* switch mode button have an account then sign in page then not have a/c move to sign up page  */}
                                <Button onClick={switchMode}>
                                    {isSignUp ? "Already have an account? Sign In" : "Don't have account? Sign Up"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
            {/* popup message  */}
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
}

export default Auth;
