import React, { useState, useEffect } from 'react';
import { Card, Divider, makeStyles, Typography } from "@material-ui/core";
import NewPost from "./NewPost"
import PostList from "./PostList"
// import abortController from 'AbortController';
import { listNewsFeed } from "./api-post";
import auth from "../auth/auth-helper";

const useStyles = makeStyles(theme => ({
    card: {
      margin: 'auto',
      paddingTop: 0,
      paddingBottom: theme.spacing(3)
    },
    title: {
      padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
      color: theme.palette.openTitle,
      fontSize: '1em'
    },
    media: {
      minHeight: 330
    }
  }))

export default function Newsfeed() {
    const classes = useStyles()
    const [posts, setPosts] = useState([]);
    const jwt = auth.isAuthenticated()
    console.log("NewsFeed 1\n JWT: ", jwt);

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        console.log("NewsFeed 2");

        listNewsFeed({ userId: jwt.user._id }, { t: jwt.token }, signal)
            .then((data) => {
                if (data && data.error) {
                    console.log("Getig Error: ",data.error);
                } else {
                    console.log("list new Data: ", data);
                    setPosts(data)
                }
            })
            return function cleanup(){
                abortController.abort()
            }
    }, []);

    const addPost = (post) => {
        const updatedPosts = [...posts]
        updatedPosts.unshift(post)
        setPosts(updatedPosts)
    }
    const removePost = (post) => {
        const updatedPosts = [...posts]
        const index = updatedPosts.indexOf(post)
        updatedPosts.splice(index, 1)
        setPosts(updatedPosts)
    }
    return (<div>
        {/* <Card> */}
            {/* <Typography type="title" className={classes.title}>##Newsfeed##</Typography>
            <Divider/> */}
            <NewPost addUpdate={addPost}/>
            {/* <Divider/> */}
            <PostList removeUpdate={removePost} posts={posts}/>
        {/* </Card> */}
    </div>)
};
