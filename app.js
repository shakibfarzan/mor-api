const createError = require('http-errors');
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('config');

const db = config.get('db')
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log(`Connected to ${db}...`));



const app = express();

const genres = require('./routes/genres')
const instruments = require('./routes/instruments')
const persons = require('./routes/persons')
const musicians = require('./routes/musicians')
const artists = require('./routes/artists')
const albums = require('./routes/albums')
const songs = require('./routes/songs')
const users = require('./routes/users')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use('/api/genres', genres)
app.use('/api/instruments', instruments)
app.use('/api/persons', persons)
app.use('/api/musicians', musicians)
app.use('/api/artists', artists)
app.use('/api/albums', albums)
app.use('/api/songs', songs)
app.use('/api/users', users)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;
