const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    description: {
        type: String
    }
})

const Genre = mongoose.model('Genre', genreSchema)

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        description: Joi.string()
    })

    return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;

