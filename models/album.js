const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');

const albumSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 50,
        required: true,
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

albumSchema.methods.findSongs = async function () {
    return await mongoose.model('Song').find({ 'album._id': this._id });
}

const Album = mongoose.model('Album', albumSchema);

function validateAlbum(album) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        artistId: Joi.string().required(),
        year: Joi.number().min(1700).max(new Date().getFullYear()),
        cover: Joi.string()
    })
    return schema.validate(album)
}

exports.albumSchema = albumSchema;
exports.Album = Album;
exports.validate = validateAlbum;