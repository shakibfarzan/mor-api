const express = require('express');
const router = express.Router()
const { Instrument, validate } = require('../models/instrument')
const { Musician } = require('../models/musician')
const { Artist } = require('../models/artist')
const { Song } = require('../models/song')

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
    let instrument = await Instrument.findById(req.params.id)

    if (!instrument) return res.status(404).send("Instrument Not Found")
    const prevInstrument = instrument
    instrument.name = req.body.name;

    instrument = await instrument.save()

    //Update instruments of musicians
    const musicians = await Musician.find({ instruments: prevInstrument })

    musicians.forEach(async musician => {
        const prevMusician = musician;
        musician.instruments.forEach(i => {
            if (i._id === instrument._id) {
                i.name = instrument.name
            }
        })
        await musician.save();
        const artists = await Artist.find({ line_up: prevMusician })
        artists.forEach(async a => {
            a.line_up.forEach(m => {
                if (m._id === musician._id) {
                    m.instruments = musician.instruments;
                }
            })
            await a.save()
        })
        const songs = await Song.find({ featuring: prevMusician })
        songs.forEach(async song => {
            song.featuring.forEach(m => {
                if (m._id === musician._id) {
                    m.instruments = musician.instruments;
                }
            })
            await song.save()
        })
    })

    res.send(instrument)
})

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
    const instrument = await Instrument.findByIdAndDelete(req.params.id);

    if (!instrument) return res.status(404).send("Instrument Not Found")

    const musicians = await Musician.find({ instruments: instrument })

    musicians.forEach(async musician => {
        const prevMusician = musician
        const removed = musician.instruments.filter(i => i._id !== instrument._id);
        musician.instruments = { ...removed };
        await musician.save();

        const artists = await Artist.find({ line_up: prevMusician })
        artists.forEach(async a => {
            a.line_up.forEach(m => {
                if (m._id === musician._id) {
                    m.instruments = musician.instruments;
                }
            })
            await a.save();
        })
        const songs = await Song.find({ featuring: prevMusician })
        songs.forEach(async song => {
            song.featuring.forEach(m => {
                if (m._id === musician._id) {
                    m.instruments = musician.instruments;
                }
            })
            await song.save();
        })

    })



    res.send(instrument)
})

module.exports = router