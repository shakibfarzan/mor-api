const mongoose = require('mongoose');
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { personSchema } = require('./person')

const suggestionSchema = new mongoose.Schema({
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
    description: {
        type: String,
        required: true,
        maxlength: 2048
    },
    contents: [String],
    links: [String],
    dateUploaded: {
        type: Date,
        default: Date.now
    },
})

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

function validateSuggestion(suggestion) {
    const schema = Joi.object({
        artistName: Joi.string().min(2).max(255).required(),
        description: Joi.string().max(2048).required(),
        links: Joi.array().items(Joi.string())
    })
    return schema.validate(suggestion)
}

exports.suggestionSchema = suggestionSchema;
exports.Suggestion = Suggestion;
exports.validate = validateSuggestion;