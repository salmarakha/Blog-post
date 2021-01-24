const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user');

const asyncVerify = promisify(jwt.verify);

const auth = async (req, res, next) => {
    const { headers: { authorization } } = req;
    // console.log(authorization);
    if(!authorization) next((new Error('invalid login')));
    try {
        const { id } = await asyncVerify(authorization, 'secret');
        const user = await User.findById(id).exec();
        req.user = user;
        next();
    } catch (e) {
        next(e);
    }
}

const ownsBlog = (req, res, next) => {
    const { user } = req;
    const { id } = req.params;
    const index = user.blogs.findIndex(blog => blog === parseInt(id))
    if (index === -1) {
        res.status(422).json({Error: "Blog does not exist"});
    } else next();
}

const ownsBlogs = (req, res, next) => {
    const { user } = req;
    const userBlogs = user.blogs;
    if (!userBlogs.length){
        res.status(422).json({Error: "No blogs to show"});
    } else {
        let blogsIds = [];
        user.blogs.forEach(blog => blogsIds.push(blog));
        req.blogs = blogsIds;
        next()
    }
} 

module.exports = {
    auth,
    ownsBlog,
    ownsBlogs,
}