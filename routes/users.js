const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const validateMiddleWare = require("../middlewares/validateMiddleWare")
const bcrypt = require("bcrypt");
const _ = require('lodash')
const { User, validate } = require("../models/user");
const { Person } = require("../models/person")
const fileIO = require("../utils/fileIO")
const fileValidator = require("../utils/fileValidator")

const dest = "public/images/avatars/"
const dbPath = "images/avatars/"


router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", validateMiddleWare(validate), async (req, res) => {

  const { nameId, username, email, password } = req.body

  let user = await User.findOne({ email });
  if (user) return res.status(400).send("User already registered.");

  user = await User.findOne({ username })
  if (user) return res.status(400).send("This username is already taken!")

  const name = await Person.findById(nameId);
  if (!name) return res.status(400).send("Invalid name ID!")

  let avatar = []
  if (req.files.avatar) {
    const errors = fileValidator(req.files.avatar, { maxCount: 1, maxSize: 1024 * 1024, mimeTypes: ['image/jpeg', 'image/png'] })
    if (errors.length !== 0) return res.status(400).send(errors)
    avatar = fileIO.save(req.files.avatar, dest, dbPath)
  }

  avatar = (avatar.length === 0) ? '' : avatar.pop()

  user = new User({ name, username, email, password, avatar });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("token", token)
    .send(_.pick(user, ["_id", "name", "username", "email"]));
});

router.put("/me", auth, async (req, res) => {
  let { nameId, username, email, password } = req.body

  const currentUser = await User.findById(req.user._id)

  let user = null;

  if (email !== currentUser.email) {
    user = await User.findOne({ email });
    if (user) return res.status(400).send("Email is unavailable!");
  }

  if (username !== currentUser.username) {
    user = await User.findOne({ username })
    if (user) return res.status(400).send("Username is already taken!")
  }

  const name = await Person.findById(nameId);
  if (!name) return res.status(400).send("Invalid name ID!")

  fileIO.delete(currentUser.avatar, 'public/')

  let avatar = []
  if (req.files.avatar) {
    avatar = fileIO.save(req.files.avatar, dest, dbPath)
  }

  if (password !== currentUser.password) {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
  }

  currentUser.name = name
  currentUser.username = username
  currentUser.email = email
  currentUser.password = password
  currentUser.avatar = avatar.pop()

  await currentUser.save()

  const token = currentUser.generateAuthToken();

  res.send(token)
})

router.delete("/me", auth, async (req, res) => {

  const user = await User.findByIdAndDelete(req.user._id)

  fileIO.delete(user.avatar, 'public/')

  res.send(user)
})

module.exports = router;
