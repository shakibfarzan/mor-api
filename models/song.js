const mongoose = require('mongoose');
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

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
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 2,
                maxlength: 50,
            },
            year: {
                type: Number,
                min: 1700,
                max: new Date().getFullYear(),
                required: true
            },
            cover: String,
        }),
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
    },
    isSingleTrack: {
        type: Boolean,
        default: false
    }
})

const Song = mongoose.model('Song', songSchema);

function validateSong(song) {
    const schema = Joi.object({
        name: Joi.string().max(50).required(),
        artistId: Joi.objectId().required(),
        albumId: Joi.objectId(),
        genreId: Joi.objectId().required(),
        type: Joi.string().valid('OriginalSong', 'BackingTrack', 'JamTrack').required(),
        dateUploaded: Joi.date(),
        likes: Joi.number(),
        isSingleTrack: Joi.boolean()
    })
    return schema.validate(song)
}

exports.songSchema = songSchema;
exports.Song = Song;
exports.validate = validateSong;