import React, { useState, useEffect } from 'react';

// pakges ui
import { AppBar, Toolbar, Typography, Avatar, Button } from '@material-ui/core';

// packages
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { decode } from 'jsonwebtoken';

// style
import useStyles from './Styles'

// images
import memoriesLogo from '../../images/memories-Logo.png';
import memoriesText from '../../images/memories-Text.png';

const Navbar = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();


    /**
     * logout function
     */
    const logout = () => {
        dispatch({ type: "LOGOUT" });
        navigate('/auth');
        setUser(null);
    };

    useEffect(() => {
        const token = user?.token;
        // token expired then user logout function call automation (user logout)
        if (token) {
            const decodedToken = decode(token);
            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }
        // get user localstorage
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);


    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <Link to='/auth' className={classes.brandContainer}>
                <img src={memoriesText} alt="icon" height="45px" />
                <img className={classes.image} src={memoriesLogo} alt="icon" height="40px" />
            </Link>
            <Toolbar>
                {user ?
                    (
                        <div className={classes.profile}>
                            <Link to={`/posts/user-profile/${user?.result?._id}`} >
                                <Avatar className={classes.purple} alt={user?.result?.name} src={user?.result?.imageUrl}>{user?.result?.name.charAt(0)}</Avatar>
                            </Link>
                            <Typography className={classes.userName} variant='h6'>{user.result?.name}</Typography>
                            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>LogOut</Button>
                        </div>
                    ) : (
                        null
                    )
                }
            </Toolbar>
        </AppBar>

    );
}

export default Navbar;
