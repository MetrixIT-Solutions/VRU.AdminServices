/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

// process.env.NODE_ENV = 'dev';
// process.env.PORT = '3502';

// process.env.NODE_ENV = 'test';
// process.env.PORT = '3508';

process.env.NODE_ENV = 'prod';
process.env.PORT = '3517';

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var config = require('config');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var device = require('express-device');
var session = require('express-session');
var passport = require('passport');
var fs = require('fs');
var mongoose = require('mongoose');

var logger = require('./src/lib/logger');

// ============================================= Begin of app.js ========================================= //

var app = express();
app.set('trust proxy', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(device.capture({parseUserAgent: true}));
app.set('env', 'production');

var jsonParser = bodyParser.json({limit: '10mb'});
var urlencodedParser = bodyParser.urlencoded({
  extended: false, limit: '10mb', parameterLimit: 500
});
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:4226' // ['', '', ...]
// }));

app.use(session({
    secret: 'bbqh_admin_secret_key',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'config')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/assets', express.static(path.join(__dirname, 'assets')));
// app.use(express.static(path.join(__dirname, 'assets')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in production
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'production' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, vruadatoken, vruadotoken, vrucutoken', 'vruaduiinfo');

  // Response headers you wish to Expose
  res.setHeader('Access-Control-Expose-Headers', 'X-Requested-With, content-type, vruadatoken, vruadotoken, vrucutoken');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', false);

  // Pass to next layer of middleware
  next();
});

// dynamically include routes
fs.readdirSync('./src/routes/v1').forEach((file) => {
  if (file.substr(-3) == '.js') {
    require('./src/routes/v1/' + file).controller(app, passport);
  }
});

module.exports = app;

// ============================================= End of app.js ========================================= //


// --- Start of Code to Handle Uncaught Exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception: ' + error);
});
// --- End of Code for Handle Uncaught Exceptions

// --- Start: Mongoose
mongoose.Promise = Promise;
// --- Connect to the db
mongoose.connect(config.mongoDBConnection)
.then(() => logger.error('Connected MongoDB.'))
.catch((error) => logger.error('MongoDB Connection: Error: ' + error));
// --- End: Mongoose
