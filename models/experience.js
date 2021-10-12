const mongoose = require('mongoose');
const { personSchema } = require('./person');
const Joi = require('joi')

const experienceSchema = new mongoose.Schema({
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
    text: {
        type: String,
        maxlength: 2048,
        required: true
    },
    dateUploaded: {
        type: Date,
        default: Date.now
    },
    isDisplaying: {
        type: Boolean,
        default: true
    }
})

const Experience = mongoose.model('Experience', experienceSchema);

function validateExperience(experience) {
    const schema = Joi.object({
        text: Joi.string().max(2048).required()
    })

    return schema.validate(experience);
}

exports.experienceSchema = experienceSchema;
exports.Experience = Experience;
exports.validate = validateExperience;