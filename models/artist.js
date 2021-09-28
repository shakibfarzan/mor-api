const mongoose = require('mongoose');
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { musicianSchema } = require('./musician');

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true
    },
    epithet: {
        type: String,
        maxlength: 50,
    },
    biography: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    line_up: [musicianSchema],
    personal_influences: String,
    essential_stylistic_features: String,
    harmonic_material: String,
    sound: String,

})

const Artist = mongoose.model('Artist', artistSchema);

function validateArtist(artist) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        epithet: Joi.string().max(50),
        biography: Joi.string().required(),
        line_up: Joi.array().items(Joi.objectId().required()),
        personal_influences: Joi.string(),
        essential_stylistic_features: Joi.string(),
        harmonic_material: Joi.string(),
        sound: Joi.string(),
    })

    return schema.validate(artist)
}

exports.artistSchema = artistSchema;
exports.Artist = Artist;
exports.validate = validateArtist;