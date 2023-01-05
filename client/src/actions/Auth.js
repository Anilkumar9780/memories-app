// action type component
import { AUTH, RESET_PASSWORD } from '../constants/actionTypes';

// packages
import { toast } from 'react-toastify';

// api 
import * as api from '../api/Index.js';

/**
 *  user signin 
 * @param {object} formData   
 */
export const signin = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signIn(formData);
        console.log(data.message)
        dispatch({ type: AUTH, data })
        navigate('/');
        toast.success(data.message, {
            position: "bottom-right"
        });
    } catch (err) {
        toast.error(err.response.data.message, {
            position: "bottom-right"
        });
    }
};

/**
 * user signup 
 * @param {object} formData 
 * @param {*} navigate 
 */
export const signup = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);
        dispatch({ type: AUTH, data });
        navigate('/');
        toast.success(data.message, {
            position: "bottom-right",
            type: "success",
        });
    } catch (err) {
        toast.error(err.response.data.message, {
            position: "bottom-right"
        });
    }
};

export const resetPassword = (email) => async (dispatch) => {
    try {
        const { data } = await api.resetPasswordApi(email);
        dispatch({ type: RESET_PASSWORD, payload: data });
        toast.success(data.message, {
            position: "bottom-right",
            type: "success",
        });
    } catch (err) {
        toast.error(err.response.data.message, {
            position: "bottom-right"
        });
    }
};


export const newPasswordGen = (password, token) => async (dispatch) => {
    try {
        const { data } = await api.newPasswordApi(password, token);
        dispatch({ type: "NEW_PASSWORD", data });
        toast.success(data.message, {
            position: "bottom-right",
            type: "success",
        });
    } catch (err) {
        toast.error(err.response.data.message, {
            position: "bottom-right"
        });
    }
};