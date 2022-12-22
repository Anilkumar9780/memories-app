import React, { useEffect } from 'react';

//styles
import useStyles from './Styles';

// packges
import { Typography, Divider, Paper, CircularProgress } from '@material-ui/core';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

//component
import { getPostDetail } from '../../actions/Posts';
import { getPostBySearch } from './../../actions/Posts';

const PostsDetails = () => {
    const { post, posts, isLoading } = useSelector((state) => state.posts);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const classes = useStyles();


    useEffect(() => {
        dispatch(getPostDetail(id));
    }, [id]);

    useEffect(() => {
        if (post) {
            dispatch(getPostBySearch({ search: 'none', tags: post?.tags.join(',') }));
        }
    }, [post]);

    if (!post) return null;

    if (isLoading) {
        return <Paper className={classes.loadingPaper} elevation={6}>
            <CircularProgress size="7em" />
        </Paper>
    };

    const recommendedPosts = posts.filter(({ _id }) => _id == post._id);
    console.log(recommendedPosts);

    const openPost = (id) => navigate(`/posts/${id}`);

    return (
        <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
            <div className={classes.card}>
                <div className={classes.section}>
                    <Typography variant="h3" component="h2">{post.title}</Typography>
                    <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
                    <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
                    <Typography variant="h6">Created by: {post.name}</Typography>
                    <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
                    <Divider style={{ margin: '20px 0' }} />
                    <Typography variant="body1"><strong>Realtime Chat - coming soon!</strong></Typography>
                    <Divider style={{ margin: '20px 0' }} />
                    <Typography variant="body1"><strong>Comments - coming soon!</strong></Typography>
                    <Divider style={{ margin: '20px 0' }} />
                </div>
                <div className={classes.imageSection}>
                    <img className={classes.media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
                </div>
            </div>
            {recommendedPosts.length && (
                <div className={classes.section}>
                    <Typography gutterBottom variant='h5'> You might also like : </Typography>
                    <Divider />
                    <div className={classes.recommendedPosts}>
                        {recommendedPosts?.map((data) =>
                            <div style={{ margin: "20px", cursor: "pointer", borderRadius: '15px' }} onClick={() => openPost(data._id)} key={data._id}>
                                <Typography gutterBottom variant='h6'> {data.title}</Typography>
                                <Typography gutterBottom variant='subtitle2'> {data.name}</Typography>
                                <Typography gutterBottom variant='subtitle2'> {data.message}</Typography>
                                <Typography gutterBottom variant='subtitle3'>Likes: {data.likes?.length}</Typography>
                                <img width='200px' src={data.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={data.title} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Paper>
    );
}

export default PostsDetails;
