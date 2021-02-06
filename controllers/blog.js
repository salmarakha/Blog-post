const Blog = require('../models/blog');
const User = require('../models/user');

const getAll = () => {
    return Blog.find().exec()
}

const getUserBlogs = async (blogs) => {
    console.log(blogs[0]);
    let userBlogs = [];
    for (let i = 0; i < blogs.length; i++) {
        let blog = await Blog.findById(blogs[i]).exec()
        userBlogs.push(blog)
    }
    return userBlogs;
}

const getById = async (id) => await Blog.findById(id).exec();

const getHomeBlogs = () => {
    const today = new Date();
    return Blog.find({postDate: {$gte:"2021-01-23 01:00:00.000Z", $lte: today}}).populate('author').exec();
}

const postBlog = async (blog) => {
    const blogs = await getAll();
    blog._id = (blogs.length) ? blogs[blogs.length - 1]._id + 1 : 1;
    let user = await User.findById(blog.author).exec();
    let userBlogs = user.blogs;
    userBlogs.push(blog._id);
    user.blogs = userBlogs;
    await User.findByIdAndUpdate(blog.author, user, { new: true }).exec();
    return Blog.create(blog);
};

const searchAuthor = (key) => {
    try{
        return Blog.find({ author: key }).exec();
    } catch(e) {
        next(e)
    }
}

const search = (key) => {
    return Blog.find({ $or: [{ tags: new RegExp(key, 'i') }, { title: new RegExp(key, 'i') }] }).exec();
}

const edit = async (id, BlogToEdit) => await Blog.findByIdAndUpdate(id, BlogToEdit, { new: true }).exec();

const deleteBlog = async (id, user) => {
    const userBlogs = user.blogs;
    const index = userBlogs.findIndex(blog => blog === parseInt(id));
    userBlogs.splice(index, 1);
    user.blogs = userBlogs;
    await User.findByIdAndUpdate(user._id, user, { new: true }).exec();
    return await Blog.findByIdAndDelete(id).exec();
}
module.exports = {
    getAll,
    getUserBlogs,
    getById,
    postBlog,
    search,
    searchAuthor,
    edit,
    deleteBlog,
    getHomeBlogs,
}