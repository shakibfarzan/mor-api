const express = require('express');
const router = express.Router()
const { Comment, validate } = require('../models/comment');
const { Song } = require('../models/song');
const { User } = require('../models/user');
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const validateObjectId = require('../middlewares/validateObjectId')
const validateMiddleWare = require('../middlewares/validateMiddleWare')

router.get('/:songId', async (req, res) => {
    const comments = await Comment.find({ "song._id": req.params.songId }).sort("dateSent")
    res.send(comments)
})

router.post('/', [auth, validateMiddleWare(validate)], async (req, res) => {

    const song = await Song.findById(req.body.songId).select("name");
    if (!song) return res.status(400).send("Invalid song ID!")

    const user = await User.findById(req.user._id).select("name username")

    const comment = new Comment({ user, song, body: req.body.body })

    await comment.save()

    res.send(comment)
})

router.put('/:id', [auth, validateObjectId, validateMiddleWare(validate)], async (req, res) => {

    const comment = await Comment.findOne({ "_id": req.params.id, "user._id": req.user._id });
    if (!comment) return res.status(404).send("Comment Not Found!")

    comment.body = req.body.body

    await comment.save()

    res.send(comment)
})

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {

    const comment = await Comment.findByIdAndDelete(req.params.id)
    if (!comment) return res.status(404).send("Comment Not Found!")

    res.send(comment)
})

router.delete('/myComments/:id', [validateObjectId, auth], async (req, res) => {

    const comment = await Comment.findOneAndDelete({ "_id": req.params.id, "user._id": req.user._id })
    if (!comment) return res.status(404).send("Comment Not Found!")

    res.send(comment)
})

module.exports = router