import React, { useState, useRef } from 'react';

//ui packages
import { Typography, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';

//style
import useStyles from './Styles';

//component
import { commentPost } from '../../actions/Posts';

const CommentSection = ({ post }) => {
    const classes = useStyles();
    const [comments, setComments] = useState(post?.comments);
    const [comment, setComment] = useState('');
    const user = JSON.parse(localStorage.getItem("profile"));
    const commentsRef = useRef();
    const dispatch = useDispatch();

    /**
     *  handle user comment by user at post 
     */
    const handleComment = async () => {
        const finalComment = `${user.result.name} : ${comment}`
        const newComments = await dispatch(commentPost(finalComment, post._id));
        setComments(newComments);
        setComment('');
        commentsRef.current.scrollIntoView({ behavior: "smooth" })
    };

    return (
        <div>
            <div className={classes.commentOuterContainer}>
                <div className={classes.commentsInnerContainer}>
                    {/* mapping user comment */}
                    <Typography gutterBottom variant='h6'>Comments</Typography>
                    {comments.map((c, i) => (
                        <Typography key={i} gutterBottom variant='subtitle1'>
                            <strong > {c.split(': ')[0]}</strong>
                            {c.split(':')[1]}
                        </Typography>
                    ))}
                    <div ref={commentsRef} />
                </div>
                {/* comment input */}
                {user?.result?.name && (
                    <div style={{ width: '70%' }}>
                        <Typography gutterBottom variant='h6' >Write a Comment</Typography>
                        <TextField
                            fullWidth
                            minRows={4}
                            variant='outlined'
                            label='Comment'
                            multiline
                            value={comment}
                            onChange={(event) => setComment(event.target.value)}
                        />
                        {/* submit  */}
                        <Button
                            style={{ marginTop: '10px' }}
                            fullWidth
                            disabled={!comment}
                            variant='contained'
                            onClick={handleComment}
                            color='primary'
                        >
                            Comment
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommentSection;
