import React from 'react';

// mataerial ui packages
import { Container } from '@material-ui/core';

//packages
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navigate } from "react-router-dom";

// component
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import PostsDetails from './components/PostsDetail/PostDetail';
import Auth from './components/Auth/Auth';

// style
import useStyles from './Styles';

const Router = () => {
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('peofile'));
  return (
    <Container maxWidth="xl">
      <Navbar />
      <Routes>
        <Route path='/' element={<Navigate to="/posts" />} />
        <Route path='/posts' exact element={<Home />} />
        <Route path='/posts/search' exact element={<Home />} />
        <Route path='/posts/:id' exact element={<PostsDetails />} />
        <Route path='/auth' exact element={!user ? <Auth /> : <Navigate to='/posts' />} />
      </Routes>
    </Container>
  )
};

export const App = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}

