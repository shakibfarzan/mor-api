const Joi = require('joi');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const { personSchema } = require('./person')

const userSchema = new mongoose.Schema({
    name: {
        type: personSchema,
        required: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        unique: true,
        required: true
    },
    username: {
        type: String,
        minlength: 5,
        maxlength: 30,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 255,
        required: true,
    },
    isAdmin: Boolean,
    favorite_songs: [String],
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
            favorite_songs: this.favorite_songs,
            avatar: this.avatar
        },
        config.get("jwtPrivateKey")
    );
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        personId: Joi.string().required(),
        email: Joi.string().min(5).max(255).required().email(),
        username: Joi.string().lowercase().min(5).max(30).required(),
        password: Joi.string().min(8).max(255).required(),
        isAdmin: Joi.boolean(),
        favorite_songs: Joi.array().items(Joi.string()),
        avatar: Joi.string()
    })

    return schema.validate(user)
}

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;