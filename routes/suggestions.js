const express = require('express');
const router = express.Router()
const { Suggestion, validate } = require('../models/suggestion');
const { User } = require('../models/user');
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const validateObjectId = require('../middlewares/validateObjectId')
const validateMiddleWare = require('../middlewares/validateMiddleWare')
const arrayBodyMiddleWare = require('../middlewares/arrayBodyMiddleWare')
const fileIO = require('../utils/fileIO')
const fileValidator = require('../utils/fileValidator')

const dest = 'public/contents/'
const dbPath = 'contents/'

router.get('/', [auth, admin], async (req, res) => {

    const suggestions = await Suggestion.find().sort("-dateUploaded")
    res.send(suggestions)
})

router.get('/mySuggestions', auth, async (req, res) => {

    const suggestions = await Suggestion.find({ "user._id": req.user._id }).sort("-dateUploaded")
    res.send(suggestions)
})

router.post('/', [auth, arrayBodyMiddleWare("links"), validateMiddleWare(validate)], async (req, res) => {
    const user = await User.findById(req.user._id).select("name username")

    const contentFiles = req.files.contents

    const errors = fileValidator(contentFiles, { maxCount: 2, maxSize: 1024 * 1024 * 50, mimeTypes: ['image/jpeg', 'image/png', 'audio/mpeg', 'video/mp4', 'image/webp'] })
    if (errors.length !== 0) return res.status(400).send(errors)

    let contents = []
    if (contentFiles) {
        fileIO.createDir(dest)
        contents = fileIO.save(contentFiles, dest, dbPath)
    }

    const { artistName, description, links } = req.body

    const suggestion = new Suggestion({ user, artistName, description, contents, links });

    await suggestion.save()

    res.send(suggestion)

})

router.put('/mySuggestions/:id', [auth, validateObjectId, validateMiddleWare(validate)], async (req, res) => {

    const suggestion = await Suggestion.findOne({ "_id": req.params.id, "user._id": req.user._id })
    if (!suggestion) return res.status(404).send("Suggestion not found!")

    const errors = fileValidator(req.files.contents, { maxCount: 2, maxSize: 1024 * 1024 * 50, mimeTypes: ['image/jpeg', 'image/png', 'audio/mpeg', 'video/mp4', 'image/webp'] })
    if (errors.length !== 0) return res.status(400).send(errors)

    fileIO.delete(suggestion.contents, 'public/')
    const contents = fileIO.save(req.files.contents, dest, dbPath)

    suggestion.artistName = req.body.artistName
    suggestion.description = req.body.description
    suggestion.links = req.body.links
    suggestion.contents = contents

    await suggestion.save()

    res.send(suggestion)
})

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {

    const suggestion = await Suggestion.findById(req.params.id);
    if (!suggestion) return res.status(404).send("Suggestion not found!");

    suggestion.isDisplaying = false;

    await suggestion.save();

    res.send(suggestion);
})


router.delete('/mySuggestions/:id', [auth, validateObjectId], async (req, res) => {

    const suggestion = await Suggestion.findOneAndDelete({ "_id": req.params.id, "user._id": req.user._id });
    if (!suggestion) return res.status(404).send("Suggestion not found!")

    fileIO.delete(suggestion.contents, 'public/')

    res.send(suggestion)
})


module.exports = router