import React from 'react';

// material ui package
import { Grid, CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';

//component
import Post from './Post/Post';

// style
import useStyles from './Styles';

const Posts = ({ setCurrentId }) => {
  const { posts, isLoading } = useSelector((state) => state.posts); // -> [] --> { posts: []}
  const classes = useStyles();

  if (!posts.length && !isLoading) return <><h1>No Posts</h1></>;

  return (
    // data empty run circulaprogress
    isLoading ? <CircularProgress /> : (
      <Grid className={classes.container} container alignItems="stretch" spacing={3}>
        {/* mapping  posts */}
        {posts.map((post) => (
          <Grid key={post._id} item xs={12} sm={6} md={6} lg={4} >
            <Post post={post} setCurrentId={setCurrentId} />
          </Grid>
        ))}
      </Grid>
    )
  );
};

export default Posts;
