const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({
    _id: Number,
    title: {
        type: String,
        minlength: 2,
        maxlength: 150,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        maxLength: 10,
    },
    comments: [{
        type: Number,
        ref: 'Comment',
    }],
    imgURL: {
        type: String,
        default: undefined,
    },
    cloudinary_id: {
        type: String,
    },
    author: {
        type: Number,
        ref: 'User',
        //required: true
    },
    postDate: {
        type: Date,
        default: Date.now(),
    }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;