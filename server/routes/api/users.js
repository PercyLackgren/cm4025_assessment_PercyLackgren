const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../../models/Users");
/*
  Beyond this point is all system specific routes.
  All routes are here for simplicity of understanding the tutorial
  /register -- Look closer at the package https://www.npmjs.com/package/passport-local-mongoose
  for understanding why we don't try to encrypt the password within our application
*/
router.post('/register', function (req, res) {
  console.log(req.body.username)
  User.register(
  new User({ 
    username: req.body.username 
  }), req.body.password, function (err, msg) {
    if (err) {
      res.send(err);
    } else {
      res.send({ message: "Successful" });
    }
  }
  )
})

/*
Login route -- This is where we will use the 'local'
passport authenciation strategy
*/
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  console.log("logged in user: " + req.user.username)  
  res.send(req.user.username)
});

/*
Logout route
*/
router.post('/logout', function(req, res, next){
  if (req.user) {
    req.logout(function(err) {
      if (err) { return next(err); }
    });
    res.send({ msg: 'logging out' })
  } else {
    res.send({ msg: 'no user to log out' })
  }
});

/*
Protected Route -- Look in the account controller for
how we ensure a user is logged in before proceeding.
We call 'isAuthenticated' to check if the request is 
authenticated or not. 
*/
router.get('/profile', function(req, res) {
  console.log(req.session)
  if (req.isAuthenticated()) {
    res.json({ user: req.user })
  } else {
    // res.json({ user: null })
  }
})

module.exports = router;