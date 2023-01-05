import React, { useEffect, useState } from 'react';

//packages
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// packages ui
import {
    CircularProgress,
    Divider,
    Typography,
    Avatar,
    Button,
    Card,
    CardHeader,
    CardContent,
    CardMedia,
    IconButton,
    CardActions,
    Collapse
} from '@material-ui/core';
import CommentIcon from '@material-ui/icons/Comment';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { styled } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

//component
import { follow, unFollow, userProfile } from '../../actions/Posts';


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const Profile = () => {
    const { id } = useParams();
    const { user, userPosts, isLoading } = useSelector((state) => state.posts);
    const [following, setFollowing] = useState();
    const users = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch()
    const url = "http://localhost:5000/";
    const navigate = useNavigate();
    const [showButton, setShowButton] = useState(false);
    const followId = users?.result?.googleId || users?.result?._id;
    const [expanded, setExpanded] = React.useState(false);

    // more message
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    //dispatch user profile req
    useEffect(() => {
        dispatch(userProfile(id));
    }, [id]);

    //post deatil page 
    const openPost = (id) => navigate(`/posts/${id}`);

    /**
     * follow user by user id
     * @param {object} user 
     */
    const handleFollowUser = (user) => {
        dispatch(follow(followId, user, setFollowing));
        setShowButton(true);
    };

    /**
     * unfollow user 
     * @param {object} user 
     */
    const hnadleUnFollowUSer = (user) => {
        const unFollowId = followId;
        dispatch(unFollow(unFollowId, user, setFollowing));
        setShowButton(true);
    };

    // show button follow and unfollow user 
    const filteredFollowingUser = user?.following?.includes(followId)

    return (
        isLoading ? <CircularProgress /> : (
            <div style={{ maxWidth: "550px", margin: "0px auto" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                    margin: "18px 0px",
                    borderBottom: "1px solid grey"
                }}>

                    <div>
                        <Avatar
                            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                            alt={user?.name}
                            src={user?.imageUrl}
                        >
                            {user?.name.charAt(0)}
                        </Avatar>
                    </div>
                    <div>
                        <Typography variant="h6"> {user?.name}</Typography>
                        <Typography variant="h6">{user?.email}</Typography>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                            <h6>{userPosts?.length} posts</h6>
                            <h6>{user?.followers?.length} followers</h6>
                            <h6>{following?.length === 1 ?
                                (<>{following?.length}</>
                                ) : (
                                    <>{user?.following?.length}</>)
                            } following
                            </h6>
                        </div>
                        {users?.result?._id === user?._id ? (null) : (
                            <>
                                {filteredFollowingUser || showButton ? (
                                    <Button
                                        style={{
                                            margin: "10px"
                                        }}
                                        variant='contained'
                                        color='primary'
                                        onClick={() => hnadleUnFollowUSer(user)}
                                    >UnFollow
                                    </Button>
                                ) : (
                                    <Button
                                        style={{
                                            margin: "10px"
                                        }}
                                        variant='outlined'
                                        color='primary'
                                        onClick={() => handleFollowUser(user)}
                                    >Follow
                                    </Button>
                                )}
                            </>)
                        }
                        <Button
                            variant='outlined'
                            color='primary'
                        >
                            ChangePassword
                        </Button>
                    </div>
                </div>
                <div className="gallery">
                    <Typography gutterBottom variant='h5'> Your Posts : </Typography>
                    <Divider />
                    {/* user posts */}
                    {userPosts?.map(item => {
                        return (
                            <Card sx={{ maxWidth: 845 }} key={item._id}>
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            alt={user?.name}
                                            src={user?.imageUrl}
                                        >
                                            {user?.name.charAt(0)}
                                        </Avatar>
                                    }
                                    action={
                                        <IconButton aria-label="settings">
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                    title={user?.name}
                                    subheader={moment(item.createdAt).fromNow()}
                                />
                                <CardMedia
                                    component="img"
                                    height="194"
                                    image={url + item?.file}
                                    alt={item?.title}
                                    onClick={() => openPost(item._id)}
                                    style={{ cursor: "pointer" }}
                                />
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="h2">{item.tags?.map((tag) => `#${tag} `)}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item?.title}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton aria-label="add to favorites">
                                        <ThumbUpAltIcon />
                                        &nbsp;
                                        <p style={{ fontSize: "16px", }}>
                                            {item?.likes.length} {item.likes.length === 1 ? 'Like' : 'Likes'}
                                        </p>
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <CommentIcon />
                                        &nbsp;
                                        <p style={{ fontSize: "16px", }}>
                                            {item?.comments.length} {item?.comments.length === 0 ? 'comment' : 'comments'}
                                        </p>
                                    </IconButton>
                                    <ExpandMore
                                        expand={expanded}
                                        onClick={handleExpandClick}
                                        aria-expanded={expanded}
                                        aria-label="show more"
                                    >
                                        <ExpandMoreIcon />
                                    </ExpandMore>
                                </CardActions>
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <Typography paragraph>Message:</Typography>
                                        <Typography paragraph>
                                            {item.message}
                                        </Typography>
                                    </CardContent>
                                </Collapse>
                            </Card>
                        )
                    })}
                </div>
            </div >
        )
    );
}

export default Profile;
