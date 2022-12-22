import { combineReducers } from 'redux';

// component
import posts from './Posts';
import Auth from './Auth'

export const reducers = combineReducers({ 
    posts,
    Auth
 });
