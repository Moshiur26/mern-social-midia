import { Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { Edit, Person } from '@material-ui/icons';
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
    }
  }))


export default function EditProfile({ match }) {
    const classes = useStyles()
    const [values, setValues] = useState({
        userId: '',
        name: '',
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
        // console.log(">>>>>:1-> user data: ");
        // const jwt = auth.isAuthenticated()
        
        // console.log(">>>>JWT: ",jwt);
        read({
            userId: match.params.userId
        }, {t: jwt.token}, signal).then((data) => {
            // console.log(">>>>>:2-> user data:2");
            if (data && data.error) {
                setValues({ ...values, redirectToSignin: true, error: data.error })
                // console.log("set redirect");
                // console.log("error: ",data.error);
            } else {
                setValues({ ...values, name: data.name, email: data.email })
                // console.log(">>>>>:-> user data: ", data);
            }
        })
        
        return function cleanup() {
            abortController.abort()
        }
    }, [match.params.userId]);
    
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value })
    }

    const clickSubmit = () => {
        if (!jwt){console.log("jwt is absent")}
        else{console.log("jwt is present");}
        // console.log(">>>jwt1: ",jwt);

        const user = {
            name: values.name || undefined,
            email: values.email || undefined,
            password: values.password || undefined
        }
        // console.log(">>>jwt2: ",jwt);
        update({
            userId: match.params.userId
        }, {t: jwt.token}, user).then((data) => {
            // console.log(">>>>>:2-> user data:2");
            if (data && data.error) {
                setValues({ ...values, error: data.error })
                // console.log("set redirect");
                // console.log("error: ",data.error);
            } else {
                setValues({ ...values, userId: data._id, redirectToProfile: true })
                // console.log(">>>>>:-> user data: ", data);
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
                <h1>Edit Profile</h1>
                <CardContent>
                    <TextField id="name" label="Name"
                        className={classes.textField}
                        value={values.name} onChange={handleChange('name')}
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
            {/* <Dialog open={values.open} disableBackdropClick={true}>
                <DialogTitle>New Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        New Account Successfully Created.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Link to="/signin">
                        <Button color="primary" autoFocus="autoFocus" variant="contained">Sign in</Button>
                    </Link>
                </DialogActions>
            </Dialog> */}
        </div>
    )    
};