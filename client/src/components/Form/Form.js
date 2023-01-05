import React, { useState, useEffect, useRef } from 'react';

//material ui package
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import useStyles from './Styles';

//packages
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//components
import { createPost, updatePost } from '../../actions/Posts';

const Form = ({
  currentId, setCurrentId
}) => {
  const [postData, setPostData] = useState({
    title: '',
    message: ' ',
    tags: '',
    file: null
  })
  const [error, setError] = useState(false);
  const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
  const user = JSON.parse(localStorage.getItem('profile'));
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const inputRef = useRef();

  // onmonut
  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  /**
   * Reset input box
   */
  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', message: '', tags: '', file: null });
    inputRef.current.value = "";
    setError(false)
  };


  /**
   * create user post 
   * @param {object} e 
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = user?.result?.name;
    if (!postData.message || !postData.title || !postData.tags) {
      setError(true);
      return false
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('user', user);
    formData.append('file', postData.file);
    formData.append('title', postData.title);
    postData.tags.forEach((tags) => formData.append("tags[]", tags));
    formData.append('message', postData.message);
    if (currentId === 0) {
      dispatch(createPost(formData, navigate));
      clear();
    } else {
      dispatch(updatePost(currentId, formData));
      clear();
    }
  };


  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper} elevation={6}>
        <Typography variant='h6' align='center'>
          Please Sign In to create your own memories and like other's memories...
        </Typography>
      </Paper>
    )
  }
  return (
    <Paper className={classes.paper} elevation={6}>
      <form
        autoComplete="off"
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
        method='post'
        encType="multipart/form-data"
      >
        <Typography variant="h6">{currentId ? `Editing "${post.title}"` : 'Creating a Memory'}</Typography>
        <TextField
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        {error && !postData.title && <span style={{ color: "red", marginLeft: "-110px" }}>post title is require</span>}
        <TextField
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          multiline
          minRows={4}
          value={postData.message}
          onChange={(e) => setPostData({ ...postData, message: e.target.value })}
        />
        {error && !postData.message && <span style={{ color: "red", marginLeft: "-110px" }}>post message is require</span>}
        <TextField
          name="tags"
          variant="outlined"
          label="Tags (coma separated)"
          fullWidth
          value={postData.tags}
          onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })}
        />
        {error && !postData.tags && <span style={{ color: "red", marginLeft: "-110px" }}>post tags is require</span>}
        <div className={classes.fileInput}>
          <TextField
            name="file"
            type="file"
            ref={inputRef}
            onChange={(e) => setPostData({ ...postData, file: e.target.files[0] })}
          />
        </div>
        <Button
          className={classes.buttonSubmit}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
        >Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={clear}
          fullWidth
        >Reset
        </Button>
      </form>
    </Paper>
  );
};

export default Form;
