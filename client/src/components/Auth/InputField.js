import React from 'react';

//material ui 
import { Grid, TextField, InputAdornment, IconButton } from '@material-ui/core';

// material icon
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


const InputField = ({
    name,
    half,
    autoFocus,
    label,
    type,
    handlePasswordShow,
    handleOnChange
}) => {
    return (
        <>
            <Grid item xs={12} sm={half ? 6 : 12}>
                <TextField
                    name={name}
                    onChange={handleOnChange}
                    autoFocus={autoFocus}
                    variant='outlined'
                    required
                    label={label}
                    fullWidth
                    type={type}
                    InputProps={name === 'password' ? {
                        endAdornment: (
                            <InputAdornment position="end" >
                                <IconButton onClick={handlePasswordShow}>
                                    {type === 'password' ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }: null}
                />
            </Grid>
        </>
    );
}

export default InputField;
