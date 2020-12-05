import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import homeImg from './../assets/images/home_1.jpg'
import auth from '../auth/auth-helper';
import Newsfeed from '../post/Newsfeed';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5)
  },
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  },
  media: {
    minHeight: 400
  }
}))

export default function Home(){  
  const classes = useStyles()
  const jwt = auth.isAuthenticated()

    return (
      <div>
        {/* <Newsfeed/> */}
        {
          auth.isAuthenticated() && <Newsfeed/>
        }
        {
          !auth.isAuthenticated() &&
          <Card className={classes.card}>
            <Typography variant="h6" className={classes.title}>
              Home Page
            </Typography>
              <CardMedia className={classes.media} image={homeImg} />
              <CardContent>
                <Typography variant="body1" component="p">
                  Welcome to the MERN Skeleton home page.
                </Typography>
              </CardContent>
          </Card>
        }
      </div>
        
    )
}