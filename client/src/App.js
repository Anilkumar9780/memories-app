import React from 'react';

// mataerial ui packages
import { Container } from '@material-ui/core';

//packages
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

// component
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import PostsDetails from './components/PostsDetail/PostDetail';
import Auth from './components/Auth/Auth';
import Profile from './components/UserProfile/Profile';
import SearchUsers from './components/UserProfile/SearchUser';
import ResetPassword from './components/Auth/ResetPassword';
import NewPassword from './components/Auth/NewPassword';

export const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  return (
    <Container maxWidth="xl">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Navigate to="/posts" />} />
          <Route path='/posts' exact element={<Home />} />
          <Route path='/posts/search' exact element={<Home />} />
          <Route path='/user/reset-password' exact element={<ResetPassword />} />
          <Route path='/user/new-password' exact element={<NewPassword />} />
          <Route path='/posts/:id' exact element={<PostsDetails />} />
          <Route path='/posts/user-profile/:id' exact element={<Profile />} />
          <Route path='/user/search-users' exact element={<SearchUsers />} />
          <Route path='/auth' exact element={!user ? <Auth /> : <Navigate to='/posts' />} />
        </Routes>
      </BrowserRouter>
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
    </Container>
  )
};
