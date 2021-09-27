const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const { Musician, validate } = require('../models/musician')
const { Person } = require('../models/person')
const { Instrument } = require('../models/instrument')

const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const validateObjectId = require('../middlewares/validateObjectId')
const validateMiddleWare = require('../middlewares/validateMiddleWare')

router.get('/', async (req, res) => {
    const musicians = await Musician.find().sort('name.lastname name.firstname')
    res.send(musicians)
})

router.get('/:id', validateObjectId, async (req, res) => {
    const musician = await Musician.findById(req.params.id);

    if (!musician) return res.status(404).send("Musician Not Found!")

    res.send(musician)
})

router.post('/', [auth, admin, validateMiddleWare(validate)], async (req, res) => {
    const name = await Person.findById(req.body.nameId)
    if (!name) return res.status(400).send('Invalid name!')

    const instrumentsBody = req.body.instruments.map(i => (
        mongoose.Types.ObjectId(i)
    ))

    const instruments = await Instrument.find({ '_id': { $in: instrumentsBody } })
    if (instruments.length === 0) return res.status(400).send('Invalid instruments Id!')

    let musician = new Musician({ name, instruments })
    musician = await musician.save()
    res.send(musician)
})

router.put('/:id', [validateObjectId, auth, admin, validateMiddleWare(validate)], async (req, res) => {

    const name = await Person.findById(req.body.nameId)
    if (!name) return res.status(400).send('Invalid name!')

    const instrumentsBody = req.body.instruments.map(i => (
        mongoose.Types.ObjectId(i)
    ))

    const instruments = await Instrument.find({ '_id': { $in: instrumentsBody } })
    if (instruments.length === 0) return res.status(400).send('Invalid instruments Id!')

    const musician = await Musician.findByIdAndUpdate(req.params.id, { name, instruments }, { new: true })
    if (!musician) return res.status(404).send("Musician Not Found")

    res.send(musician)
})

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
    const musician = await Musician.findByIdAndDelete(req.params.id);

    if (!musician) return res.status(404).send("Musician Not Found")

    res.send(musician)
})

module.exports = router