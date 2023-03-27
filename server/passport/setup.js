const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
    console.log('serializeUser called with id:', user.id);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log('deserializeUser called with id:', id);
    User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    });
});

// Local Strategy
passport.use(
    new LocalStrategy(
        {
            usernameField: 'username' // not necessary, DEFAULT
        },
        function(username, password, done) {
            User.findOne({ username: username })
                .then((user) => {
                    if (!user) {
                        return done(null, false, { message: "Incorrect username" });
                    }
                    if (!user.checkPassword(password)) {
                        return done(null, false, { message: "Incorrect password" });
                    }
                    return done(null, user);
                })
                .catch((err) => done(err));
        }
    )
);

module.exports = passport;