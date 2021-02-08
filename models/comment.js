const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    _id: Number,
    content: {
        type: String,
        required: true,
    },
    imgURL: {
        type: String,
        default: undefined,
    },
    author: {
        type: Number,
        ref: 'User',
        //required: true
    },
    postDate: {
        type: Date,
        default: new Date(),
    },
    blogId: {
        type: Number,
        ref: 'Blog',
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;