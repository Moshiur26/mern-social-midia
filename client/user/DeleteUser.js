import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@material-ui/core';
import { Delete } from "@material-ui/icons"
import { Redirect } from 'react-router';
import auth from './../auth/auth-helper';
import { remove } from './api-user';

export default function DeleteUser(props) {
    const [open, setOpen] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const jwt = auth.isAuthenticated()
    // console.log(">>>JWT: ",jwt);

    const clickButton = () => {
        setOpen(true)
    }
    
    const handleRequestClose = () => {
        setOpen(false)
    }

    const deleteAccount = () => {
        remove({ userId: props.userId }, { t: jwt.token }).then((data) => {
            if (data && data.error){
                console.log("Get Error: ", data.error);
            } else {
                auth.clearJWT(() => console.log("deleted"))
                setRedirect(true)
            }
        })
    }

    if (redirect) {
        return <Redirect to='/'/>
    }

    return(
        <span>
            <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
                <Delete/>
            </IconButton>

            <Dialog open={open} onClose={handleRequestClose}>
                <DialogTitle>{"Delete Account"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Confirm to delete your account.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRequestClose} color="primary">Cancel</Button>
                    <Button onClick={deleteAccount} color="secondary" autoFocus="autoFocus">Confirm</Button>
                </DialogActions>
            </Dialog>
        </span>
    )

};