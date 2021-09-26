const mongoose = require('mongoose');
const Joi = require('joi');

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
            }
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
        userId: Joi.string().required(),
        songId: Joi.string().required(),
        body: Joi.string().max(4096).required(),
        dateSent: Joi.date()
    })
}

exports.commentSchema = commentSchema;
exports.Comment = Comment;
exports.validate = validateComment;