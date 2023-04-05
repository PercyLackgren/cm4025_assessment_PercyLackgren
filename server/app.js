// Followed https://javascript.plainenglish.io/session-authentication-with-node-js-express-passport-and-mongodb-ffd1eea4521c

/*
  Include express and passport packages.
*/
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/*
  Include the user model for saving to MongoDB VIA mongoose
*/
const User = require("./models/User");

/*
  Database connection -- We are using MongoDB for this tutorial
*/
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const mongoString = 'mongo connection string';
mongoose.connect('mongodb://127.0.0.1:27017');
const db = mongoose.connection;

const app = express();

/*
  Session configuration and utilization of the MongoStore for storing
  the session in the MongoDB database
*/
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongoUrl: db.client.s.url })
}));

/*
  Setup the local passport strategy, add the serialize and 
  deserialize functions that only saves the ID from the user
  by default.
*/
const strategy = new LocalStrategy(User.authenticate())
passport.use(strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// Init Middleware
app.use(express.json({credentials: true, origin: "http://127.0.0.1:3000"}));

// Enable CORS for all routes
const cors = require('cors');
app.use(cors({ 
    origin: 'http://127.0.0.1:3000',
    credentials: true 
}));

// API routes
const quotes = require('./routes/api/quotes');
const costs = require('./routes/api/costs');
const users = require('./routes/api/users');
const dropdowns = require('./routes/api/dropdowns');
app.use('/api/quotes', quotes);
app.use('/api/costs', costs);
app.use('/api/users', users);
app.use('/api/dropdowns', dropdowns);

app.listen(8000, () => { console.log('Server started.') });