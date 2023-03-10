import React, { useState } from 'react';

//material ui peackage
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ThumbUpAltOutlined from "@material-ui/icons/ThumbUpAltOutlined";

//packages
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

//components
import { likePost, deletePost } from '../../../actions/Posts';

// style
import useStyles from './Styles';

const Post = ({
  post,
  setCurrentId
}) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const [likes, setLikes] = useState(post?.likes);
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const url = "http://localhost:5000/";

  const userId = user?.result?.googleId || user?.result?._id;
  const hasLikePost = post?.likes?.find((like) => like === userId);

  /**
   * handle user like at post 
   */
  const handleLike = () => {
    dispatch(likePost(post._id));
    if (hasLikePost) {
      setLikes(post.likes.filter((id) => id !== userId));
    } else {
      setLikes([...post.likes, userId]);
    }
  };

  /**
   * post  detail page
   */
  const openPost = () => {
    navigate(`/posts/${post._id}`);
  };

  /**
   * like post
   * @returns node 
   */
  const Likes = () => {
    if (post?.likes?.length > 0) {
      return likes.find((like) => like === userId)
        ? (
          <>
            <ThumbUpAltIcon fontSize="small" />
            &nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}
          </>
        ) : (
          <>
            <ThumbUpAltOutlined fontSize="small" />
            &nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
          </>
        );
    }
    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
  };

  return (
    <Card className={classes.card} raised elevation={6}>
      <CardMedia className={classes.media} image={`${url + post.file}` || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
      <div className={classes.overlay}>
        <Link to={`/posts/user-profile/${post.postedBy}`} style={{ textDecoration: 'none', color: "white" }} >
          <Typography variant="h6" >{post.name}</Typography>
        </Link>
        <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
      </div>
      {/* edit post button */}
      <div className={classes.overlay2} name="edit">
        {(user?.result?.name === post?.name || user?.result?._id === post?._id) && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentId(post._id);
            }}
            style={{ color: 'white', marginLeft: "100px" }}
            size="small"
          >
            <EditIcon />
          </Button>
        )}
      </div>
      <ButtonBase
        className={classes.cardAction}
        onClick={openPost}
      >
        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
        </div>
        <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
        </CardContent>
      </ButtonBase>
      <CardActions className={classes.cardActions}>

        {/* like button */}
        <Button
          disabled={!user?.result}
          size="small"
          color="primary"
          onClick={handleLike}
        >
          <Likes />
        </Button>

        {/* delete button */}
        {(user?.result?.name === post?.name || user?.result?._id === post?._id) && (
          <Button
            size="small"
            color="primary"
            onClick={() => dispatch(deletePost(post._id))}
          >
            <DeleteIcon fontSize="small" />
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;
