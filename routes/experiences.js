const express = require('express');
const router = express.Router()
const { Experience, validate } = require('../models/experience');
const { User } = require('../models/user');
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const validateObjectId = require('../middlewares/validateObjectId')
const validateMiddleWare = require('../middlewares/validateMiddleWare')

router.get('/', [auth, admin], async (req, res) => {

    const experiences = await Experience.find().sort("-dateUploaded")
    res.send(experiences)
})

router.get('/myExperiences', auth, async (req, res) => {

    const experiences = await Experience.find({ "user._id": req.user._id }).sort("-dateUploaded")
    res.send(experiences)
})

router.post('/', [auth, validateMiddleWare(validate)], async (req, res) => {
    const user = await User.findById(req.user._id).select("name username")

    const { text } = req.body

    const experience = new Experience({ user, text });

    await experience.save()

    res.send(experience)

})


router.put('/myExperiences/:id', [auth, validateObjectId, validateMiddleWare(validate)], async (req, res) => {

    const experience = await Experience.findOne({ "_id": req.params.id, "user._id": req.user._id })
    if (!experience) return res.status(404).send("Experience not found!")

    experience.text = req.body.text

    await experience.save()

    res.send(experience)
})

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {

    const experience = await Experience.findById(req.params.id);
    if (!experience) return res.status(404).send("Experience not found!");

    experience.isDisplaying = false;

    await experience.save();

    res.send(experience);
})

router.delete('/myExperiences/:id', [auth, validateObjectId], async (req, res) => {

    const experience = await Experience.findOneAndDelete({ "_id": req.params.id, "user._id": req.user._id });
    if (!experience) return res.status(404).send("Experience not found!")

    res.send(experience)
})


module.exports = router