const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const validateMiddleWare = require("../middlewares/validateMiddleWare")


router.get('/verify/:id', async (req, res) => {

    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).send("User not found!")

    user.isActive = true
    await user.save()

    const token = user.generateAuthToken()

    res.header("token", token).redirect('/')
})

router.post('/', validateMiddleWare(validate), async (req, res) => {

    let user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }] });
    if (!user) return res.status(400).send('Invalid username or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid username or password.');

    if (!user.isActive) return res.status(401).send('Access denied. Your account is not active.')

    const token = user.generateAuthToken();
    res.send(token);
});

function validate(req) {
    const schema = Joi.object({
        username: Joi.string().min(5).max(30).required(),
        password: Joi.string().min(8).max(255).required()
    });

    return schema.validate(req);
}

module.exports = router;