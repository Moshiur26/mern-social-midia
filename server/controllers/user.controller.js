import User from '../models/user.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable';
import fs from 'fs'
import profilePhoto from '../../client/assets/images/profile.jpg'
const create = async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        return res.status(200).json({
            message: "Successfully signed up!"
        })
    } catch (err) {
        return res.status('400').json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const list = async (req, res) => {
    try {
        let users = await User.find().select('name email updated created')
        return res.json(users)
    } catch (err) {
        return res.status('400').json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const userById = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec()
        if (!user) 
            return res.status('400').json({
                error: "User not found"
            })
        req.profile = user
        next()
    } catch (err) {
        return res.status('400').json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const read = async (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}
const update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }
        let user = req.profile
        // user = extend(user, req.body)
        user = extend(user, fields)
        user.updated = Date.now()
        if(files.photo){
            user.photo.data = fs.readFileSync(files.photo.path)
            user.photo.contentType = files.photo.type
        }
        try {
            await user.save()
            user.hashed_password = undefined
            user.salt = undefined
            return res.json(user)
        } catch (err) {
            res.status('400').json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}
const remove = async (req, res) => {
    try {       
        let user = req.profile
        let delateUser = await user.remove()
        delateUser.hashed_password = undefined
        delateUser.salt = undefined
        return res.json(delateUser)
        } catch (err) {
            return res.status('400').json({
                error: errorHandler.getErrorMessage(err)
            })
        }
}
const photo = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set("Content-type", req.profile.photo.contentType)
        return res.send(req.profile.photo.data)
    }
    next()
}
const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd() + profilePhoto)
}
const addFollowing = async (req, res, next) => {
    try{
        await User.findByIdAndUpdate(req.body.userId, {$push: {following: req.body.followId}})
        next()
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const addFollower = async (req, res) => {
    try{
        let result = await User.findByIdAndUpdate(req.body.followId, {$push: {followers: req.body.userId}}, {new: true})
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec()
        result.hashed_password = undefined
        result.salt = undefined
        res.json(result)
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const removeFollowing = async (req, res, next) => {
    try{
        await User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}})
        next()
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const removeFollower = async (req, res) => {
    try{
        let result = await User.findByIdAndUpdate(req.body.unfollowId, {$pull: {followers: req.body.userId}}, {new: true})
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec()
        result.hashed_password = undefined
        result.salt = undefined
        res.json(result)
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const findPeople = async (req, res) => {
    let following = req.profile.following
    following.push(req.profile._id)

    try {
        let users = await User.find({_id: { $nin: following }})
            .select('name')
        res.json(users)
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}


export default { create, list, userById, read, update, remove, photo, defaultPhoto, addFollowing, addFollower, removeFollowing, removeFollower, findPeople }