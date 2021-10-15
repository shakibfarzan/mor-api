const express = require('express');
const router = express.Router()
const { Person, validate } = require('../models/person')
const { User } = require('../models/user')
const { Comment } = require('../models/comment')
const { Experience } = require('../models/experience')
const { Suggestion } = require('../models/suggestion');
const { Favorite } = require('../models/favorite');
const { Musician } = require('../models/musician');
const { Artist } = require('../models/artist');
const { Song } = require('../models/song');

const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const validateObjectId = require('../middlewares/validateObjectId')
const validateMiddleWare = require('../middlewares/validateMiddleWare')

router.get('/', async (req, res) => {
    const persons = await Person.find().sort('lastname firstname')
    res.send(persons)
})

router.get('/:id', validateObjectId, async (req, res) => {
    const person = await Person.findById(req.params.id);

    if (!person) return res.status(404).send("Person Not Found!")

    res.send(person)
})

router.post('/', [validateMiddleWare(validate)], async (req, res) => {
    let person = new Person({ firstname: req.body.firstname, lastname: req.body.lastname, nickname: req.body.nickname })
    person = await person.save()
    res.send(person)
})

router.put('/:id', [validateObjectId, auth, validateMiddleWare(validate)], async (req, res) => {
    let person = await Person.findById(req.params.id)

    if (!person) return res.status(404).send("Person Not Found")

    person.firstname = req.body.firstname;
    person.lastname = req.body.lastname;
    person.nickname = req.body.nickname;

    const user = await User.findOne({ "name._id": person._id });
    if (user) {
        user.name = person;
        await user.save();

        const comments = await Comment.find({ "user._id": user._id })
        comments.forEach(async comment => {
            comment.user.name = person;
            await comment.save();
        })

        const experiences = await Experience.find({ "user._id": user._id })
        experiences.forEach(async ex => {
            ex.user.name = person;
            await ex.save();
        })

        const suggestions = await Suggestion.find({ "user._id": user._id });
        suggestions.forEach(async suggestion => {
            suggestion.user.name = person;
            await suggestion.save();
        })

        const favorites = await Favorite.find({ "user._id": user._id });
        favorites.forEach(async favorite => {
            favorite.user.name = person;
            await favorite.save();
        })
    }

    const musician = await Musician.findOne({ "name._id": person._id })
    if (musician) {
        const prevMusician = musician
        musician.name = person;
        await musician.save();

        const artists = await Artist.find({ line_up: prevMusician })
        artists.forEach(async artist => {
            artist.line_up.forEach(m => {
                if (m._id === musician._id) {
                    m = musician;
                }
            })
            await artist.save();
        })

        const songs = await Song.find({ featuring: prevMusician })
        songs.forEach(async song => {
            song.featuring.forEach(m => {
                if (m._id === musician._id) {
                    m = musician;
                }
            })
            await song.save();
        })
    }


    person = await person.save();

    res.send(person)
})

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
    const person = await Person.findByIdAndDelete(req.params.id);

    if (!person) return res.status(404).send("Person Not Found")

    res.send(person)
})

module.exports = router