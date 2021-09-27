const express = require('express');
const router = express.Router()
const { Genre, validate } = require('../models/genre')

const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const validateObjectId = require('../middlewares/validateObjectId')
const validateMiddleWare = require('../middlewares/validateMiddleWare')

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name')
    res.send(genres)
})

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send("Genre Not Found!")

    res.send(genre)
})

router.post('/', [auth, admin, validateMiddleWare(validate)], async (req, res) => {
    let genre = new Genre({ name: req.body.name, description: req.body.description })
    genre = await genre.save()
    res.send(genre)
})

router.put('/:id', [validateObjectId, auth, admin, validateMiddleWare(validate)], async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name, description: req.body.description }, { new: true })

    if (!genre) return res.status(404).send("Genre Not Found")

    res.send(genre)
})

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if (!genre) return res.status(404).send("Genre Not Found")

    res.send(genre)
})

module.exports = router