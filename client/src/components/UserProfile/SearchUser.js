import React from 'react';

// material ui
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, CircularProgress } from '@material-ui/core';

//packages
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SearchUsers = () => {
    const { users, isLoading } = useSelector((state) => state.posts);
    return (
        isLoading ? <CircularProgress /> : (
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {/* mapping users */}
                {users?.map((user) => (
                    <Link to={`/posts/user-profile/${user._id}`} >
                        <ListItem key={user._id}>
                            <ListItemAvatar>
                                <Avatar>
                                    {user?.name.charAt(0)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={user?.name} secondary={user?.email} />
                        </ListItem>
                    </Link>
                ))}
            </List>
        )
    );
}

export default SearchUsers;
