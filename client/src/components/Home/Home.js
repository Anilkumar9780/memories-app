import React, { useState, useEffect } from 'react';

// mataerial ui packages
import { Container, Grow, Grid, Paper, AppBar, TextField, Button } from '@material-ui/core';

//packages
import { useDispatch, } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

//components
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import { getPostBySearch, searchUsers } from '../../actions/Posts';
import Paginate from '../Pagination/Pagination';

//style
import useStyles from './Styles'

// search query 
function useQuery() {
    return new URLSearchParams(useLocation().search);
};

const Home = () => {
    const [currentId, setCurrentId] = useState(0);
    const [searchUserProfile, setSearchUserProfile] = useState('');
    const user = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch();
    const classes = useStyles();
    const query = useQuery();
    const navigate = useNavigate();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);

    /**
     * search post 
     */
    const searchPost = () => {
        if (search.trim() || tags) {
            dispatch(getPostBySearch({ search, tags: tags.join(',') }));
            navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
        } else {
            navigate('/');
        };
    };

    /**
     * enter key call the saerch post function
     * @param {object} e 
     */
    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            searchPost();
        };
    };

    /**
     * search  user profile 
     */
    const handleUserProfileSearch = () => {
        if (searchUserProfile.trim()) {
            dispatch(searchUsers(searchUserProfile));
            navigate(`/user/search-users`);
        } else {
            navigate('/');
        };
    }

    /**
     * enter key call the saerch post function
     * @param {object} e 
     */
    const handleKey = (e) => {
        if (e.keyCode === 13) {
            handleUserProfileSearch();
        };
    };

    // add tags
    const handleAdd = (tag) => setTags([...tags, tag]);

    // Delete tags
    const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !== tagToDelete));

    useEffect(() => {
        if (!user) {
            navigate("/auth");
            return;
        }
        return;
    }, [user]);

    return (
        <Grow in>
            <Container maxWidth='xl'>
                <Grid container justifyContent="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
                    <Grid item xs={12} sm={7} >
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={3}>
                        <AppBar className={classes.appBarSearch} position='static' color='inherit'>
                            <TextField
                                name="search"
                                variant='outlined'
                                label='Search Memories'
                                fullWidth
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <ChipInput
                                style={{ margin: '10px 0' }}
                                value={tags}
                                onAdd={handleAdd}
                                onDelete={handleDelete}
                                variant='outlined'
                                label='Search Tags'
                            />
                            <Button
                                onClick={searchPost}
                                className={classes.searchButton}
                                variant='contained'
                                color='primary'
                            >
                                Search
                            </Button>
                        </AppBar>
                        <AppBar className={classes.appBarSearch} position='static' color='inherit'>
                            <TextField
                                name="search"
                                variant='outlined'
                                label='Search User Profile'
                                fullWidth
                                value={searchUserProfile}
                                onChange={(e) => setSearchUserProfile(e.target.value)}
                                onKeyDown={handleKey}
                            />

                            <Button
                                onClick={handleUserProfileSearch}
                                className={classes.searchButton}
                                variant='contained'
                                color='primary'
                            >
                                Search Users
                            </Button>
                        </AppBar>

                        <Form currentId={currentId} setCurrentId={setCurrentId} />
                        {(!searchQuery && !tags?.length) && (
                            <Paper className={classes.pagination} elevation={4}>
                                <Paginate page={page} />
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    );
}

export default Home;

