const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const { Musician, validate } = require('../models/musician')
const { Person } = require('../models/person')
const { Instrument } = require('../models/instrument')
const { Artist } = require('../models/artist')
const { Song } = require('../models/song');

const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const validateObjectId = require('../middlewares/validateObjectId')
const validateMiddleWare = require('../middlewares/validateMiddleWare')
const arrayBodyMiddleWare = require('../middlewares/arrayBodyMiddleWare')

router.get('/', async (req, res) => {
    const musicians = await Musician.find().sort('name.lastname name.firstname')
    res.send(musicians)
})

router.get('/:id', validateObjectId, async (req, res) => {
    const musician = await Musician.findById(req.params.id);

    if (!musician) return res.status(404).send("Musician Not Found!")

    res.send(musician)
})

router.post('/', [auth, admin, arrayBodyMiddleWare("instruments"), validateMiddleWare(validate)], async (req, res) => {
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

    let musician = await Musician.findById(req.params.id)
    if (!musician) return res.status(404).send("Musician Not Found")

    const prevMusician = musician
    musician.instruments = instruments;
    musician.name = name;

    musician = await musician.save();

    const artists = await Artist.find({ line_up: prevMusician })
    artists.forEach(artist => {
        artist.line_up.forEach(m => {
            if (m._id === musician._id) {
                m = musician;
            }
        })
        await artist.save();
    })

    const songs = await Song.find({ featuring: prevMusician })
    songs.forEach(song => {
        song.featuring.forEach(m => {
            if (m._id === musician._id) {
                m = musician;
            }
        })
        await song.save();
    })

    res.send(musician)
})

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
    const musician = await Musician.findByIdAndDelete(req.params.id);

    if (!musician) return res.status(404).send("Musician Not Found")

    const artists = await Artist.find({ line_up: musician })
    artists.forEach(artist => {
        const removed = artist.line_up.filter(m => m._id !== musician._id);
        artist.line_up = { ...removed };
        await artist.save();
    })

    const songs = await Song.find({ featuring: musician })
    songs.forEach(song => {
        const removed = song.featuring.filter(m => m._id !== musician._id);
        song.line_up = { ...removed };
        await song.save();
    })

    res.send(musician)
})

module.exports = router