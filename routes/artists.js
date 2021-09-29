const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const { Artist, validate } = require('../models/artist');
const { Musician } = require('../models/musician');
const { Song } = require('../models/song')
const { Album } = require('../models/album')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const validateObjectId = require('../middlewares/validateObjectId')
const validateMiddleWare = require('../middlewares/validateMiddleWare')
const arrayBodyMiddleWare = require('../middlewares/arrayBodyMiddleWare')
const fileIO = require('../utils/fileIO')
const fileValidator = require('../utils/fileValidator')

const dest = 'public/images/artists/'
const dbPath = 'images/artists'

router.get('/', async (req, res) => {
    const artists = await Artist.find().sort('name')
    res.send(artists)
})

router.get('/:id', validateObjectId, async (req, res) => {
    const artist = await Artist.findById(req.params.id);

    if (!artist) return res.status(404).send("Artist Not Found!")

    res.send(artist)
})

router.get('/discography/:id', validateObjectId, async (req, res) => {
    const discography = { albums: [], single_tracks: [] }

    const single_tracks = await Song.find({ "artist._id": req.params.id, isSingleTrack: true })
    const albums = await Album.find({ "artist._id": req.params.id }).select('-artist')

    discography.albums = albums
    discography.single_tracks = single_tracks

    res.send(discography)
})

router.post('/', [auth, admin, arrayBodyMiddleWare("line_up"), validateMiddleWare(validate)], async (req, res) => {

    const errors = fileValidator(req.files.images, { maxCount: 2, minSize: 20000, maxSize: 1024 * 1024, mimeTypes: ['image/png', 'image/jpeg'], required: true })

    if (errors.length !== 0) return res.status(400).send(errors)

    let line_up = []

    if (req.body.line_up) {
        const lineUpBody = req.body.line_up.map(m => (mongoose.Types.ObjectId(m)))
        line_up = await Musician.find({ '_id': { $in: lineUpBody } })
        if (line_up.length === 0) return res.status(400).send('Invalid musicians Id!')
    }

    const images = fileIO.save(req.files.images, dest, dbPath)

    const { name, epithet, biography, personal_influences, essential_stylistic_features, harmonic_material, sound } = req.body

    let artist = new Artist({ name, epithet, biography, images, line_up, personal_influences, essential_stylistic_features, harmonic_material, sound })
    artist = await artist.save()
    res.send(artist)
})

router.put('/:id', [validateObjectId, auth, admin, validateMiddleWare(validate)], async (req, res) => {
    let artist = await Artist.findById(req.params.id)
    if (!artist) return res.status(404).send("Artist Not Found")

    const errors = fileValidator(req.files.images, { maxCount: 2, minSize: 20000, maxSize: 1024 * 1024, mimeTypes: ['image/png', 'image/jpeg'], required: true })
    if (errors.length !== 0) return res.status(400).send(errors)

    fileIO.delete(artist.images, 'public/')

    let line_up = []

    if (req.body.line_up) {
        const lineUpBody = req.body.line_up.map(m => (mongoose.Types.ObjectId(m)))
        line_up = await Musician.find({ '_id': { $in: lineUpBody } })
        if (line_up.length === 0) return res.status(400).send('Invalid musicians Id!')
    }

    const images = fileIO.save(req.files.images, dest, dbPath)

    const { name, epithet, biography, personal_influences, essential_stylistic_features, harmonic_material, sound } = req.body

    artist.name = name;
    artist.epithet = (epithet) ? epithet : artist.epithet;
    artist.biography = biography;
    artist.personal_influences = (personal_influences) ? personal_influences : artist.personal_influences;
    artist.essential_stylistic_features = (essential_stylistic_features) ? essential_stylistic_features : artist.essential_stylistic_features;
    artist.harmonic_material = (harmonic_material) ? harmonic_material : artist.harmonic_material;
    artist.sound = (sound) ? sound : artist.sound;
    artist.images = images;
    artist.line_up = (line_up.length === 0) ? artist.line_up : line_up;

    artist = await artist.save()

    res.send(artist)
})

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
    const artist = await Artist.findByIdAndDelete(req.params.id);

    if (!artist) return res.status(404).send("Artist Not Found")

    fileIO.delete(artist.images, 'public/')

    res.send(artist)
})

module.exports = router