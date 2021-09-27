const mongoose = require('mongoose');
const Joi = require('joi');

const instrumentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    }
})

const Instrument = mongoose.model('Instrument', instrumentSchema);

function validateInstrument(instrument) {
    const schema = Joi.object({
        name: Joi.string().max(50).required()
    })

    return schema.validate(instrument)
}

exports.instrumentSchema = instrumentSchema;
exports.Instrument = Instrument;
exports.validate = validateInstrument;