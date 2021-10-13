const mongoose = require('mongoose');
const { personSchema } = require('./person')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const commentSchema = new mongoose.Schema({
    user: {
        type: new mongoose.Schema({
            name: {
                type: personSchema,
                required: true
            },
            username: {
                type: String,
                minlength: 5,
                maxlength: 30,
                lowercase: true,
                required: true
            },
            avatar: String
        }),
        required: true
    },
    song: {
        type: new mongoose.Schema({
            name: {
                type: String,
                maxlength: 50,
                required: true
            },
        }),
        required: true
    },
    body: {
        type: String,
        required: true,
        maxlength: 4096
    },
    dateSent: {
        type: Date,
        default: Date.now
    }
})

const Comment = mongoose.model('Comment', commentSchema);

function validateComment(comment) {
    const schema = Joi.object({
        songId: Joi.objectId().required(),
        body: Joi.string().max(4096).required(),
    })
    return schema.validate(comment)
}

exports.commentSchema = commentSchema;
exports.Comment = Comment;
exports.validate = validateComment;