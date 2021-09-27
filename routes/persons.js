const express = require('express');
const router = express.Router()
const { Person, validate } = require('../models/person')

const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const validateObjectId = require('../middlewares/validateObjectId')
const validateMiddleWare = require('../middlewares/validateMiddleWare')

router.get('/', async (req, res) => {
    const persons = await Person.find().sort('lastname firstname')
    res.send(persons)
})

router.get('/:id', validateObjectId, async (req, res) => {
    const person = await Person.findById(req.params.id);

    if (!person) return res.status(404).send("Person Not Found!")

    res.send(person)
})

router.post('/', [auth, admin, validateMiddleWare(validate)], async (req, res) => {
    let person = new Person({ firstname: req.body.firstname, lastname: req.body.lastname, nickname: req.body.nickname })
    person = await person.save()
    res.send(person)
})

router.put('/:id', [validateObjectId, auth, admin, validateMiddleWare(validate)], async (req, res) => {
    const person = await Person.findByIdAndUpdate(req.params.id, { firstname: req.body.firstname, lastname: req.body.lastname, nickname: req.body.nickname }, { new: true })

    if (!person) return res.status(404).send("Person Not Found")

    res.send(person)
})

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
    const person = await Person.findByIdAndDelete(req.params.id);

    if (!person) return res.status(404).send("Person Not Found")

    res.send(person)
})

module.exports = router