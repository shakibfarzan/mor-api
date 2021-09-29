const mongoose = require('mongoose');
const { songSchema } = require('./song')
const { personSchema } = require('./person')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const favoriteSchema = new mongoose.Schema({
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
                required: true,
            },
        }),
        required: true
    },
    song: {
        type: songSchema,
        required: true
    }
})

const Favorite = mongoose.model('Favorite', favoriteSchema);
function validateFavorite(favoriteObj) {
    const schema = Joi.object({
        songId: Joi.objectId().required()
    })

    return schema.validate(favoriteObj)
}

exports.favoriteSchema = favoriteSchema
exports.Favorite = Favorite
exports.validate = validateFavorite