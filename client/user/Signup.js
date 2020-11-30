import React, { useState, useEffect } from 'react';
import { create } from './api-user'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, TextField, Typography } from '@material-ui/core'
import {  } from '@material-ui/icons'
import { Link } from 'react-router-dom';

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

export default function Signup() {
    const classes = useStyles()
    const [values, setValues] = useState({
        name: '',
        password: '',
        email: '',
        open: false,
        error: ''
    });
    useEffect(() => {
        
    }, []);
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value })
    }
    const clickSubmit = () => {
        const user = {
            name: values.name || undefined,
            email: values.email || undefined,
            password: values.password || undefined
        }
        create(user).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, error: '', open: true })
            }
        })
    }
    return (
        <div>
            <Card className={classes.card}>
                <h1>Signup</h1>
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
            <Dialog open={values.open} disableBackdropClick={true}>
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
            </Dialog>
        </div>
    )    
};
