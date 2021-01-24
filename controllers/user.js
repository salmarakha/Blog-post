const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const asyncSign = promisify(jwt.sign);


const getAll = async () => await User.find().exec();

const getById = async(id) => await User.findById(id).exec();

const create = async (newUserInfo) => {
    const users = await getAll();
    newUserInfo._id = (users.length) ? users[users.length - 1]._id + 1 : 1;
    return User.create(newUserInfo);
}

const login = async ({username, password}) => {
    console.log(username);
    const user = await User.findOne({username}).exec();
    console.log(user);
    const valid = user.validatePassword(password);
    if (!valid) throw (new Error('invalid login'));
    const token = await asyncSign({
        username: user.username,
        id: user.id,
      }, 'secret', { expiresIn: '24h' });
    return { ...user.toJSON(), token };
}

const follow = async (id, user) => {
    const loggedUserId = user.id;
    if (id != loggedUserId && !user.following.find(item => item == id)){
        User.updateOne({ _id: loggedUserId}, { $push : { following: id } } ,{new: true}).exec();
        User.updateOne({ _id: id}, { $push: { followers: loggedUserId } }, { new: true }).exec();
    } else {
        throw new Error("Id invalid");
    }
    const followedUser = await User.findById(id);
    return followedUser;
}

const unfollow = async (id, user) => {
    const loggedUserId = user.id;
    const loggedUser = await User.findById(loggedUserId).exec();
    if (id != loggedUserId && !loggedUser.following.find(item => item == id)){
        User.updateOne({ _id: loggedUserId}, { $pull : { following: id } } ,{new: true}).exec();
        User.updateOne({ _id: id}, { $pull: { followers: loggedUserId } }, { new: true }).exec();
    } else {
        throw new Error("Id invalid");
    }
    const followedUser = await User.findById(id);
    return followedUser;
}

const edit = (id, content) => User.findByIdAndUpdate(id, content, { new: true }).exec();

const deleteUser = (id) => User.findByIdAndDelete(id).exec();

module.exports = {
    getAll,
    getById,
    create,
    login,
    follow,
    unfollow,
    edit,
    deleteUser,
}