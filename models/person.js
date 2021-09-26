const Joi = require('joi');
const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    lastname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    nickname: {
        type: String,
        maxlength: 50
    }
})

const Person = mongoose.model('Person', personSchema)

function validatePerson(person) {
    const schema = Joi.object({
        firstname: Joi.string().min(2).max(50).required(),
        lastname: Joi.string().min(2).max(50).required(),
        nickname: Joi.string().min(2).max(50)
    })
    return schema.validate(person)
}

exports.Person = Person;
exports.personSchema = personSchema;
exports.validate = validatePerson;