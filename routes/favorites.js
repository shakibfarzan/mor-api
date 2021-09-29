const express = require('express');
const router = express.Router()
const { Song } = require('../models/song')
const { Favorite, validate } = require('../models/favorite')
const auth = require('../middlewares/auth')
const validateObjectId = require('../middlewares/validateObjectId')
const validateMiddleWare = require('../middlewares/validateMiddleWare')

router.post('/', [auth, validateMiddleWare(validate)], async (req, res) => {

    const song = await Song.findById(req.body.songId)
    if (!song) return res.status(400).send("Invalid song ID!")

    const user = await User.findById(req.user._id).select("name username")

    const favorite = new Favorite({ song, user })

    await favorite.save()

    res.send(favorite)
})

router.delete('/:id', [auth, validateObjectId], async (req, res) => {

    const favorite = await Favorite.findByIdAndDelete(req.params.id);
    if (!favorite) return res.status(400).send("Invalid ID!")

    res.send(favorite)
})

module.exports = router