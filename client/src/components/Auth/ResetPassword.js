import React, { useState } from 'react';

//style
import useStyles from './Styles';

//material ui components
import { Container, Avatar, Paper, Grid, Typography, Button, TextField } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

//packages
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//component
import { resetPassword } from '../../actions/Auth';

const ResetPassword = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    // reset password
    const handleResetPassword = () => {
        dispatch(resetPassword(email));
        navigate('/user/new-password')
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <Paper className={classes.paper} elevation={3}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography variant='h5'>Reset Password</Typography>
                    <form className={classes.form} onSubmit={handleResetPassword}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    name='email'
                                    label='Email Address'
                                    onChange={(event) => setEmail(event.target.value)}
                                    value={email}
                                    type="email"
                                    fullWidth
                                    variant='outlined'
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Button fullWidth type='submit' variant='contained' color='primary' className={classes.submit}>reset Password</Button>
                    </form>
                </Paper>
            </Container>
        </>
    );
}

export default ResetPassword;
