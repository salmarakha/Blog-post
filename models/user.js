const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    _id: Number,
    username: {
        type: String,
        required: true,
        minLength: 6,
        unique: true
    },
    password: String,
    blogs: [{
        type: Number,
        ref: 'Blog',
    }],
    following: [{
        type: Number,
        ref: 'User',
    }],
    followers: [{
        type: Number,
        ref: 'User',
    }],
},
    {
        toJSON: {
            transform: (doc, ret, options) => {
                delete ret.password;
                return ret;
            },
        },
    });

userSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, 8);
    next();
});

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.pre('findOneAndUpdate', function preSave(next) {
    if (!this._update.password) {
        return;
    }
    this._update.password = bcrypt.hashSync(this._update.password, 8);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;