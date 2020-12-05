import mongoose from 'mongoose'
import crypto from 'crypto'

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: 'Name is required'
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    likes: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    comments: {
        type: String,
        created: { type: Date, default: Date.now },
        postedBy: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
    }
})
export default mongoose.model('Post', PostSchema)