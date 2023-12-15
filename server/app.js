// Followed https://javascript.plainenglish.io/session-authentication-with-node-js-express-passport-and-mongodb-ffd1eea4521c
require('dotenv').config();

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
  Database connection
*/
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});
const db = mongoose.connection;

const app = express();

/*
  Session configuration and utilization of the MongoStore for storing
  the session in the MongoDB database
*/
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongoUrl: db.client.s.url }),
  cookie: {
    sameSite: 'None', // Set SameSite attribute to None
    secure: true,      // Set Secure attribute to true for HTTPS
  },
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
// app.use(express.json({
//   credentials: true, 
//   origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://cm4025-assessment-percy-lackgren.vercel.app/']
// }));

// Enable CORS for all routes
const cors = require('cors');
app.use(cors({
  origin: 'https://cm4025-assessment-percy-lackgren.vercel.app',
  credentials: true,
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

// Use PORT provided in environment or default to 3000
const port = process.env.PORT || 3000;

// Listen on `port` and 0.0.0.0
app.listen(port, "0.0.0.0", function () {
  console.log('Server started.')
});
