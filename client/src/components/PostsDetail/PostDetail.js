import React, { useEffect } from 'react';

//styles
import useStyles from './Styles';

// packges
import { Typography, Divider, Paper, CircularProgress } from '@material-ui/core';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';


//component
import CommentSection from './CommentSection';
import { getPostDetail } from '../../actions/Posts';
import { getPostBySearch } from './../../actions/Posts';

const PostsDetails = () => {
    const { post, posts, isLoading } = useSelector((state) => state.posts);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const classes = useStyles();
    const url = "http://localhost:5000/";

    /**
     *  dispatch post details
     */
    useEffect(() => {
        dispatch(getPostDetail(id));
    }, [id]);

    // dispatch search post 
    useEffect(() => {
        if (post) {
            dispatch(getPostBySearch({ search: 'none', tags: post?.tags.join(',') }));
        }
    }, [post]);

    // post null then return null
    if (!post) return null;

    // loading 
    if (isLoading) {
        return <Paper className={classes.loadingPaper} elevation={6}>
            <CircularProgress size="7em" />
        </Paper>
    };

    // recommended posts 
    const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

    // on click recommended post push reommended post detail
    const openPost = (id) => navigate(`/posts/${id}`);

    return (
        <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
            {/* post detail page */}
            <div className={classes.card}>
                <div className={classes.section}>
                    <Typography variant="h3" component="h2">{post.title}</Typography>
                    <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
                    <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
                    <Link to={`/posts/user-profile/${post.postedBy}`} style={{ textDecoration: 'none', color: "black" }} >
                        <Typography variant="h6">Created by: {post.name}</Typography>
                    </Link>
                    <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
                    <Divider style={{ margin: '20px 0' }} />
                    <Typography variant="body1"><strong>Realtime Chat - coming soon!</strong></Typography>
                    <Divider style={{ margin: '20px 0' }} />
                    <CommentSection post={post} />
                    <Divider style={{ margin: '20px 0' }} />
                </div>
                <div className={classes.imageSection}>
                    <img width='300px' className={classes.media} src={url + post.file || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
                </div>
            </div>
            {/* recommmended posts */}
            {
                !!recommendedPosts.length && (
                    <div className={classes.section}>
                        <Typography gutterBottom variant='h5'> You might also like : </Typography>
                        <Divider />
                        <div className={classes.recommendedPosts}>
                            {recommendedPosts.map(({ title, _id, name, likes, message, file }) =>
                                <div style={{ margin: "20px", cursor: "pointer", borderRadius: '15px' }} onClick={() => openPost(_id)} key={_id}>
                                    <Typography gutterBottom variant='h6'> {title}</Typography>
                                    <Typography gutterBottom variant='subtitle2'> {name}</Typography>
                                    <Typography gutterBottom variant='subtitle2'> {message}</Typography>
                                    <Typography gutterBottom variant='subtitle1'>Likes: {likes?.length}</Typography>
                                    <img width='200px' src={url + file} alt={title} />
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </Paper >
    );
}

export default PostsDetails;
