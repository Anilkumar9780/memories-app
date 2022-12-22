// action type component
import { AUTH } from '../constants/actionTypes';

// packages
import { toast } from 'react-toastify';

// api 
import * as api from '../api/Index.js';

export const signin = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signIn(formData);
        dispatch({ type: AUTH, data })
        navigate('/');
        toast.success("Sign In successfuly", {
            position: "bottom-right",
        });
    } catch (error) {
        console.log(error);
    }
};


export const signup = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);
        dispatch({ type: AUTH, data });
        navigate('/');
        toast.success("Sign Up successfuly", {
            position: "bottom-right",
        })
    } catch (error) {
        console.log(error);
    }
};