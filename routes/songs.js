const express = require('express');
const router = express.Router()
const { Song, validate } = require('../models/song');
const { Artist } = require('../models/artist');
const { Album } = require('../models/album')
const { Genre } = require('../models/genre')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const validateObjectId = require('../middlewares/validateObjectId')
const validateMiddleWare = require('../middlewares/validateMiddleWare')
const fileIO = require('../utils/fileIO')
const fileValidator = require('../utils/fileValidator')

const dest = 'public/audios/'
const dbPath = 'audios/'

router.get('/', async (req, res) => {
    const songs = await Song.find().sort('artist.name name')
    res.send(songs)
})

router.get('/:id', validateObjectId, async (req, res) => {
    const song = await Song.findById(req.params.id);

    if (!song) return res.status(404).send("Song Not Found!")

    res.send(song)
})

router.post('/', [auth, admin, validateMiddleWare(validate)], async (req, res) => {

    const file = req.files.url

    const errors = fileValidator(file, { maxCount: 1, maxSize: 1024 * 1024 * 50, mimeTypes: ['audio/mpeg'], required: true })
    if (errors.length !== 0) return res.status(400).send(errors)

    const url = fileIO.save(file, dest, dbPath).pop()

    const { name, type, dateUploaded, likes, artistId, albumId, genreId, isSingleTrack } = req.body

    const artist = await Artist.findById(artistId).select('name')
    if (!artist) return res.status(400).send('Invalid artist ID!')

    if (albumId) {
        const album = await Album.findById(albumId).select('-artist')
        if (!album) return res.status(400).send('Invalid album ID!')
    }

    const genre = await Genre.findById(genreId).select('name')
    if (!genre) return res.status(400).send('Invalid genre ID!')

    let song = new Song({ name, artist, album, genre, url, type, dateUploaded, likes, isSingleTrack })
    song = await song.save()
    res.send(song)
})

router.put('/:id', [validateObjectId, auth, admin, validateMiddleWare(validate)], async (req, res) => {
    let song = await Song.findById(req.params.id)
    if (!song) return res.status(404).send("Song Not Found")

    const file = req.files.url

    const errors = fileValidator(file, { maxCount: 1, maxSize: 1024 * 1024 * 50, mimeTypes: ['audio/mpeg'], required: true })
    if (errors.length !== 0) return res.status(400).send(errors)

    fileIO.delete(song.url, 'public/')

    const url = fileIO.save(file, dest, dbPath).pop()

    const { name, type, dateUploaded, likes, artistId, albumId, genreId, isSingleTrack } = req.body

    const artist = await Artist.findById(artistId).select('name')
    if (!artist) return res.status(400).send('Invalid artist ID!')

    let album = {}
    if (albumId) {
        album = await Album.findById(albumId).select('-artist')
        if (!album) return res.status(400).send('Invalid album ID!')
    }

    const genre = await Genre.findById(genreId).select('name')
    if (!genre) return res.status(400).send('Invalid genre ID!')

    song.name = name
    song.artist = artist
    song.album = album
    song.genre = genre
    song.url = url
    song.type = type
    song.dateUploaded = dateUploaded
    song.likes = likes
    song.isSingleTrack = isSingleTrack

    song = await song.save()
    res.send(song)
})

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
    const song = await Song.findByIdAndDelete(req.params.id);

    if (!song) return res.status(404).send("Song Not Found")

    fileIO.delete(song.url, 'public/')

    res.send(song)
})

module.exports = router