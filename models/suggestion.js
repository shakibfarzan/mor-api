const mongoose = require('mongoose');
const Joi = require('joi');
const { personSchema } = require('./person')

const suggestionSchema = new mongoose.Schema({
    user: {
        type: new mongoose.Schema({
            name: {
                type: personSchema,
                required: true
            },
            email: {
                type: String,
                minlength: 5,
                maxlength: 255,
                required: true
            }
        }),
        required: true
    },
    artistName: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true
    },
    link: {
        type: String,
    },
    description: {
        type: String,
    },
    content: {
        type: String
    }
})

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

function validateSuggestion(suggestion) {
    const schema = Joi.object({
        userId: Joi.string().required(),
        artistName: Joi.string().min(2).max(255).required(),
        link: Joi.string(),
        description: Joi.string(),
        content: Joi.string()
    })
    return schema.validate(suggestion)
}

exports.suggestionSchema = suggestionSchema;
exports.Suggestion = Suggestion;
exports.validate = validateSuggestion;