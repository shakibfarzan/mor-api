const express = require('express');
const router = express.Router()
const { Song } = require('../models/song')
const { User } = require('../models/user')
const { Favorite, validate } = require('../models/favorite')
const auth = require('../middlewares/auth')
const validateObjectId = require('../middlewares/validateObjectId')
const validateMiddleWare = require('../middlewares/validateMiddleWare')


router.post('/', [auth, validateMiddleWare(validate)], async (req, res) => {

    const user = await User.findById(req.user._id).select("name username");

    const song = await Song.findById(req.body.songId);
    if (!song) return res.status(400).send("Invalid song ID!")

    const favorite = new Favorite({ user, song })

    await favorite.save()

    res.send(favorite)
})

router.delete('/:id', [auth, validateObjectId], async (req, res) => {

    const favorite = await Favorite.findOneAndDelete({ "song._id": req.params.id, "user._id": req.user._id })
    if (!favorite) return res.status(400).send("Invalid ID!")

    res.send(favorite)
})

module.exports = router