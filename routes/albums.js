const express = require('express');
const router = express.Router()
const { Album, validate } = require('../models/album');
const { Artist } = require('../models/artist');
const { Song } = require('../models/song')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const validateObjectId = require('../middlewares/validateObjectId')
const validateMiddleWare = require('../middlewares/validateMiddleWare')
const fileIO = require('../utils/fileIO')
const fileValidator = require('../utils/fileValidator')

const dest = 'public/images/albums/'
const dbPath = 'images/albums/'

router.get('/', async (req, res) => {
    const albums = await Album.find().sort('artist.name name')
    res.send(albums)
})

router.get('/:id', validateObjectId, async (req, res) => {
    const album = await Album.findById(req.params.id);

    if (!album) return res.status(404).send("Album Not Found!")

    res.send(album)
})

router.get('/songs/:id', validateObjectId, async (req, res) => {

    const songs = await Song.find({ "album._id": req.params.id }).select('-album')

    res.send(songs)
})

router.post('/', [auth, admin, validateMiddleWare(validate)], async (req, res) => {

    const coverFile = req.files.cover

    const errors = fileValidator(coverFile, { maxCount: 1, minSize: 15000, maxSize: 1024 * 1024, mimeTypes: ['image/png', 'image/jpeg'] })
    if (errors.length !== 0) return res.status(400).send(errors)

    let cover = ''

    if (coverFile) {
        cover = fileIO.save(coverFile, dest, dbPath).pop()
    }

    const artist = await Artist.findById(req.body.artistId).select('name')

    if (!artist) return res.status(400).send("Invalid artist ID!")

    let album = new Album({ name: req.body.name, artist, year: req.body.year, cover })
    album = await album.save()
    res.send(album)
})

router.put('/:id', [validateObjectId, auth, admin, validateMiddleWare(validate)], async (req, res) => {
    let album = await Album.findById(req.params.id)
    if (!album) return res.status(404).send("Album Not Found")

    const errors = fileValidator(req.files.cover, { maxCount: 1, minSize: 15000, maxSize: 1024 * 1024, mimeTypes: ['image/png', 'image/jpeg'] })
    if (errors.length !== 0) return res.status(400).send(errors)

    fileIO.delete(album.cover, 'public/')

    const coverFile = req.files.cover

    let cover = ''

    if (coverFile) {
        cover = fileIO.save(coverFile, dest, dbPath).pop()
    }

    const artist = await Artist.findById(req.body.artistId).select('name')
    if (!artist) return res.status(400).send("Invalid artist ID!")

    album.name = req.body.name
    album.artist = artist
    album.year = req.body.year
    album.cover = cover

    album = await album.save()

    res.send(album)
})

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
    const album = await Album.findByIdAndDelete(req.params.id);

    if (!album) return res.status(404).send("Album Not Found")

    fileIO.delete(album.cover, 'public/')

    res.send(album)
})

module.exports = router