import { Avatar, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Edit, Person } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import auth from '../auth/auth-helper';
import { read } from './api-user';

import DeleteUser from './DeleteUser';

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
      maxWidth: 600,
      margin: 'auto',
      padding: theme.spacing(3),
      marginTop: theme.spacing(5)
    }),
    title: {
      marginTop: theme.spacing(3),
      color: theme.palette.protectedTitle
    }
  }))

export default function Profile({ match }) {
    const classes = useStyles()
    const [user, setUser] = useState({});
    const [redirectToSignin, setRedirectToSignin] = useState(false);

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        // console.log(">>>>>:1-> user data: ");
        const jwt = auth.isAuthenticated()
        
        // console.log(">>>>JWT: ",jwt);
        read({
            userId: match.params.userId
        }, {t: jwt.token}, signal).then((data) => {
            // console.log(">>>>>:2-> user data:2");
            if (data && data.error) {
                setRedirectToSignin(true)
                // console.log("set redirect");
                // console.log("error: ",data.error);
            } else {
                setUser(data)
                // console.log(">>>>>:-> user data: ", data);
            }
        })
        
        return function cleanup() {
            abortController.abort()
        }
    }, [match.params.userId]);
    
    if (redirectToSignin) {
        return (<Redirect to='/signin'/>)
    }

    return(
        <div>
            <Paper className={classes.root} elevation={4}>
                <Typography variant="h6" className={classes.title}>Profile</Typography>
                <List dense>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <Person/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={user.name} secondary={user.email}/>
                        { auth.isAuthenticated().user && auth.isAuthenticated().user._id == user._id && (
                            <ListItemSecondaryAction>
                                <Link to={"/user/edit/" + user._id}>
                                    <IconButton arial-label="Edit" color="primary">
                                        <Edit/>
                                    </IconButton>
                                </Link>
                                <DeleteUser userId={user._id}/>
                            </ListItemSecondaryAction>
                            ) 
                        }
                    </ListItem>
                    <Divider/>
                    <ListItem>
                        <ListItemText primary={"Joined: " + (new Date(user.created)).toDateString()}/>
                    </ListItem>
                </List>
            </Paper>
        </div>
    )
};