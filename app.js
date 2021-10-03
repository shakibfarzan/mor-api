const createError = require('http-errors');
require('express-async-errors')
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true })
  .then(() => console.log(`Connected to ${process.env.DATABASE}...`));



const app = express();

const genres = require('./routes/genres')
const instruments = require('./routes/instruments')
const persons = require('./routes/persons')
const musicians = require('./routes/musicians')
const artists = require('./routes/artists')
const albums = require('./routes/albums')
const songs = require('./routes/songs')
const users = require('./routes/users')
const favorites = require('./routes/favorites')
const auth = require('./routes/auth')
const comments = require('./routes/comments')
const suggestions = require('./routes/suggestions')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(cors())

app.use('/api/genres', genres)
app.use('/api/instruments', instruments)
app.use('/api/persons', persons)
app.use('/api/musicians', musicians)
app.use('/api/artists', artists)
app.use('/api/albums', albums)
app.use('/api/songs', songs)
app.use('/api/users', users)
app.use('/api/favorites', favorites)
app.use('/api/comments', comments)
app.use('/api/suggestions', suggestions);
app.use('/api/auth', auth)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;
