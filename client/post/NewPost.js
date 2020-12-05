import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Icon, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import auth from '../auth/auth-helper';
import { create } from './api-post';
import PhotoCamera from '@material-ui/icons/PhotoCamera'

// const useStyles = makeStyles(theme => ({
//     root: {
//       backgroundColor: '#efefef',
//       padding: `${theme.spacing(3)}px 0px 1px`
//     },
//     card: {
//       maxWidth:600,
//       margin: 'auto',
//       marginBottom: theme.spacing(3),
//       backgroundColor: 'rgba(65, 150, 136, 0.09)',
//       boxShadow: 'none'
//     },
//     cardContent: {
//       backgroundColor: 'white',
//       paddingTop: 0,
//       paddingBottom: 0
//     },
//     cardHeader: {
//       paddingTop: 8,
//       paddingBottom: 8
//     },
//     photoButton: {
//       height: 30,
//       marginBottom: 5
//     },
//     input: {
//       display: 'none',
//     },
//     textField: {
//       marginLeft: theme.spacing(2),
//       marginRight: theme.spacing(2),
//       width: '90%'
//     },
//     submit: {
//       margin: theme.spacing(2)
//     },
//     filename:{
//       verticalAlign: 'super'
//     }
//   }))
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

export default function NewPost(props) {
    const classes = useStyles()
    const [values, setValues] = useState({
        text: '',
        photo: '',
        error: '',
        user: {}
    });
    const jwt = auth.isAuthenticated()

    useEffect(() => {
        setValues({ ...values, user: auth.isAuthenticated().user })
    }, []);

    const clickPost = () => {
        let postData = new FormData()
        postData.append('text', values.text)
        postData.append('photo', values.photo)

        create({ userId: jwt.user._id }, { t: jwt.token }, postData)
            .then((data) => {
                if (data && data.error) {
                    setValues({ ...values, error: data.error })
                } else {
                    setValues({ ...values, text: '', photo: ''})
                    props.addUpdate(data)
                }
            })
    }
    const handleChange = name => event => {
        const value = name === 'photo'
          ? event.target.files[0]
          : event.target.value
        setValues({...values, [name]: value })
      }
    const photoUrl = values.user._id ? 'api/users/photo/' + values.user._id : 'api/users/defaultphoto'
    return (
      <div>
            <Card className={classes.card}>
                <Typography variant="h6" className={classes.title}>
                    New Post
                </Typography>
                
                <CardContent>
                    <TextField id="text" label="text"
                        className={classes.textField}
                        multiline
                        rows="3"
                        value={values.text} onChange={handleChange('text')}
                        margin="normal"
                    />
                    <input accept="image/*" type="file" onChange={handleChange('photo')} style={{display: 'none'}} id="icon-button-file"/>
                    <label htmlFor="icon-button-file">
                        <Button variant="contained" color="default" component="span">
                            <PhotoCamera/>
                        </Button>
                    </label> <span className={classes.filename}>{values.photo? values.photo.name : ''}</span>
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
                    <Button color="primary" variant="contained" disabled={values.text === ''} onClick={clickPost} className={classes.submit}>Post</Button>
                </CardActions>
            </Card>
        </div>
    //   <div className={classes.root}>
    //     <h6>New Post</h6>
    //     <Card className={classes.card}>
    //         <CardHeader
    //             avatar={<Avatar src={photoUrl}/>}
    //             title={values.user.name}
    //             className={classes.cardHeader}
    //             />
    //         <CardContent>
    //             <TextField
    //                 placeholder="share your thoughts"
    //                 multiline
    //                 rows="3"
    //                 value={values.text}
    //                 onChange={handleChange}
    //                 className={classes.textField}
    //                 margin="normal"
    //             />
    //         </CardContent>
    //     </Card>
    // </div>
    )
};