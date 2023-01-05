import React, { useState } from 'react';

//style
import useStyles from './Styles';

//material ui components
import { Container, Avatar, Paper, Grid, Typography, Button, TextField } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

// packages
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//component
import { newPasswordGen } from '../../actions/Auth';

const NewPassword = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const { resetPassword } = useSelector((state) => state.posts);
    const token = resetPassword?.resetPasswordToken;

    // create new password 
    const hnadleGenNewPassword = () => {
        dispatch(newPasswordGen(password, token));
        navigate('/auth')
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant='h5'>New Password</Typography>
                <form className={classes.form} onSubmit={hnadleGenNewPassword}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} >
                            <TextField
                                name='password'
                                label='New Password'
                                onChange={(event) => setPassword(event.target.value)}
                                value={password}
                                type="password"
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
    );
}

export default NewPassword;
