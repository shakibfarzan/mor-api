const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const { personSchema } = require('./person')
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: personSchema,
        required: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,

    },
    username: {
        type: String,
        minlength: 5,
        maxlength: 30,
        lowercase: true,
        required: true,

    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 255,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    avatar: String
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {
            _id: this._id,
            name: this.name,
            username: this.username,
            email: this.email,
            isAdmin: this.isAdmin,
        },
        config.get("jwtPrivateKey")
    );
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        nameId: Joi.objectId().required(),
        email: Joi.string().min(5).max(255).required().email(),
        username: Joi.string().min(5).max(30).required(),
        password: Joi.string().min(8).max(255).required(),
    })

    return schema.validate(user)
}

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;