const express = require('express');
const router = express.Router()
const { Instrument, validate } = require('../models/instrument')

const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const validateObjectId = require('../middlewares/validateObjectId')
const validateMiddleWare = require('../middlewares/validateMiddleWare')

router.get('/', async (req, res) => {
    const instruments = await Instrument.find().sort('name')
    res.send(instruments)
})

router.get('/:id', validateObjectId, async (req, res) => {
    const instrument = await Instrument.findById(req.params.id);

    if (!instrument) return res.status(404).send("Instrument Not Found!")

    res.send(instrument)
})

router.post('/', [auth, admin, validateMiddleWare(validate)], async (req, res) => {
    let instrument = new Instrument({ name: req.body.name })
    instrument = await instrument.save()
    res.send(instrument)
})

router.put('/:id', [validateObjectId, auth, admin, validateMiddleWare(validate)], async (req, res) => {
    const instrument = await Instrument.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })

    if (!instrument) return res.status(404).send("Instrument Not Found")

    res.send(instrument)
})

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
    const instrument = await Instrument.findByIdAndDelete(req.params.id);

    if (!instrument) return res.status(404).send("Instrument Not Found")

    res.send(instrument)
})

module.exports = router