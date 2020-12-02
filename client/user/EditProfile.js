import { Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, TextField, Typography } from '@material-ui/core'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'

import { makeStyles } from '@material-ui/core/styles';
import { AddPhotoAlternate, Edit, Person } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import auth from '../auth/auth-helper';
import { read, update } from './api-user';

const useStyles = makeStyles(theme => ({
    card: {
      maxWidth: 600,
      margin: 'auto',
      textAlign: 'center',
      marginTop: theme.spacing(5),
      paddingBottom: theme.spacing(2)
    },
    error: {
      verticalAlign: 'middle'
    },
    title: {
      marginTop: theme.spacing(2),
      color: theme.palette.openTitle
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 300
    },
    submit: {
      margin: 'auto',
      marginBottom: theme.spacing(2)
    },
    bigAvatar: {
      width: 60,
      height: 60,
      margin: 'auto'
    },
    input: {
      display: 'none'
    },
    filename:{
      marginLeft:'10px'
    }
  }))


export default function EditProfile({ match }) {
    const classes = useStyles()
    const [values, setValues] = useState({
        userId: '',
        name: '',
        photo: '',
        about: '',
        password: '',
        email: '',
        open: false,
        error: '',
        redirectToProfile: false,
        redirectToSignin: false
    });
    const jwt = auth.isAuthenticated()

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        
        read({
            userId: match.params.userId
        }, {t: jwt.token}, signal).then((data) => {
            if (data && data.error) {
                setValues({ ...values, redirectToSignin: true, error: data.error })
            } else {
                setValues({ ...values, name: data.name, about: data.about, email: data.email })
            }
        })
        
        return function cleanup() {
            abortController.abort()
        }
    }, [match.params.userId]);
    
    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value
        setValues({ ...values, [name]: value})
    }

    const clickSubmit = () => {
        let userData = new FormData()
        values.name && userData.append('name', values.name)
        values.email && userData.append('email', values.email)
        values.password && userData.append('password', values.password)
        values.about && userData.append('about', values.about)
        values.photo && userData.append('photo', values.photo)
        
        update({
            userId: match.params.userId
        }, {t: jwt.token}, userData).then((data) => {
            if (data && data.error) {
                setValues({ ...values, error: data.error })
                console.log("error: ",data.error);
            } else {
                setValues({ ...values, redirectToProfile: true })
            }
        })
    }

    if (values.redirectToSignin) {
        return (<Redirect to='/signin'/>)
    }
    if (values.redirectToProfile) {
        return (<Redirect to={'/user/' + values.userId}/>)
    }

    return (
        <div>
            <Card className={classes.card}>
                <Typography variant="h6" className={classes.title}>
                    Edit Profile
                </Typography>
                <input accept="image/*" type="file" onChange={handleChange('photo')} style={{display: 'none'}} id="icon-button-file"/>
                <label htmlFor="icon-button-file">
                    <Button variant="contained" color="default" component="span">
                        Upload <AddPhotoAlternate/>
                    </Button>
                </label> <span className={classes.filename}>{values.photo? values.photo.name : ''}</span>
                <CardContent>
                    <TextField id="name" label="Name"
                        className={classes.textField}
                        value={values.name} onChange={handleChange('name')}
                        margin="normal"
                    />
                    <TextField id="about" label="About"
                        className={classes.textField}
                        value={values.about} onChange={handleChange('about')}
                        margin="normal"
                    />
                    <TextField id="email" label="Email"
                        className={classes.textField}
                        value={values.email} onChange={handleChange('email')}
                        margin="normal"
                    />
                    <TextField id="password" label="Password"
                        type="password"
                        className={classes.textField} 
                        value={values.password} onChange={handleChange('password')}
                        margin="normal"
                    />
                    <br/>
                    <br/>
                    {
                        values.error && (
                        <Typography component="p" color="error" >
                            <Icon color="error" className={classes.error}>error</Icon>
                            {values.error}
                        </Typography>
                        )
                    }
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
                </CardActions>
            </Card>
        </div>
    )    
};