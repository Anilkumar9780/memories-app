import { AUTH, LOGOUT } from '../constants/actionTypes';

const authReducers = (state = { authData: null }, action) => {
    switch (action.type) {
        // sign in case
        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));

            return { ...state, authData: action?.data };

        // logout case 
        case LOGOUT:
            localStorage.clear();

            return { ...state, authData: null }

        default:
            return state;
    }
};
export default authReducers;