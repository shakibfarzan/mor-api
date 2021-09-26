const mongoose = require('mongoose');
const Joi = require('joi');
const { personSchema } = require('./person')
const {instrumentSchema} = require('./instrument')

const musicianSchema = new mongoose.Schema({
    name: {
        type: personSchema,
        required: true
    },
    instruments: [instrumentSchema]
})

const Musician = mongoose.model('Musician', musicianSchema);

function musicianValidate(musician) {
    const schema = Joi.object({
        nameId: Joi.string().required(),
        instruments: Joi.array().items(Joi.string())
    })
}

exports.musicianSchema = musicianSchema;
exports.Musician = Musician;
exports.validate = musicianValidate;