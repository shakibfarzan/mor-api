const mongoose = require('mongoose');
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const config = require('config');

const albumSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 50,
        default: config.get('single-track')
    },
    artist: {
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 2,
                maxlength: 255,
                required: true
            }
        }),
        required: true
    },
    year: {
        type: Number,
        min: 1700,
        max: new Date().getFullYear(),
        required: true
    },
    cover: String,
})

const Album = mongoose.model('Album', albumSchema);

function validateAlbum(album) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50),
        artistId: Joi.objectId().required(),
        year: Joi.number().min(1700).max(new Date().getFullYear()),
    })
    return schema.validate(album)
}

exports.albumSchema = albumSchema;
exports.Album = Album;
exports.validate = validateAlbum;