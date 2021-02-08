const Comment = require('../models/comment');
const Blog = require('../models/blog');


const getAll = () => {
    return Comment.find().exec()
}

const addComment = async (comment) => {
    const comments = await getAll();
    comment._id = (comments.length) ? comments[comments.length - 1]._id + 1 : 1;
    let blog = await Blog.findById(comment.blogId).exec();
    let blogComments = blog.comments;
    blogComments.push(comment._id);
    blog.comments = blogComments;
    blog = await Blog.findByIdAndUpdate(comment.blogId, blog, { new: true }).exec();
    console.log(blog);
    console.log(comment);
    return await Comment.create(comment);
}; 

module.exports = {
    addComment,
}