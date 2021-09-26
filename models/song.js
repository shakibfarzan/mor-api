const mongoose = require('mongoose');
const Joi = require('joi');
const { albumSchema } = require('./album')

const songSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
        required: true
    },
    artist: {
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 2,
                maxlength: 255,
                required: true
            },
        }),
        required: true
    },
    album: {
        type: albumSchema,
        required: true
    },
    genre: {
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 3,
                maxlength: 50,
                required: true
            },
        }),
        required: true
    },
    url: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['OriginalSong', 'BackingTrack', 'JamTrack'],
        required: true
    },
    dateUploaded: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0,
    }
})

const Song = mongoose.model('Song', songSchema);

function validateSong(song) {
    const schema = Joi.object({
        name: Joi.string().max(50).required(),
        artistId: Joi.string().required(),
        albumId: Joi.string().required(),
        genreId: Joi.string().required(),
        url: Joi.string().required(),
        type: Joi.string().valid('OriginalSong', 'BackingTrack', 'JamTrack').required(),
        dateUploaded: Joi.date(),
        likes: Joi.number()
    })
    return schema.validate(song)
}

exports.songSchema = songSchema;
exports.Song = Song;
exports.validate = validateSong;