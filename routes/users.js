var express = require('express');
var app = express()
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../model/user')
const GoogleStrategy = require('passport-google-oauth20');
const cookieSession = require('cookie-session');
var router = express.Router();
const {google} = require('googleapis');



var auths = {};

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    keys: ['randomstringhere']
}));

passport.use(new GoogleStrategy({
        callbackURL: "/users/auth/google/redirect",
        clientID: process.env.ID,
        clientSecret:process.env.Secret,
        passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
        var clientSecret = process.env.Secret
        var clientId = process.env.ID
        var redirectUrl =  "/users/auth/google/redirect"
        var oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
        var tokenObj = { access_token: accessToken, refresh_token: refreshToken }
        oauth2Client.credentials = tokenObj;

        auths[req.session.id] = oauth2Client;


        var calendar = google.calendar('v3');
        calendar.events.list({
            auth: oauth2Client,
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime'
        }, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err)
                return;
            }
            console.log(response)

        });
    var newUser = new User({
        username: profile.id,
        name:profile.displayName,
        email: profile._json.email,
        img: profile._json.picture,
        access: accessToken,
        token: refreshToken
    })
        User.findOne({username: profile.id}).then( function (user) {
            if(user){
                return done(null, user)
            } else{
                User.createUser(newUser, function (err, user) {
                    return done(err, user);
                });
            }

        })

    }
));

router.get('/auth/google', passport.authenticate('google', { scope: ['email profile https://www.googleapis.com/auth/calendar.readonly'],access_type:"offline",prompt:"select_account", prompt:"consent" }));

router.get('/auth/google/redirect',
    passport.authenticate('google', { failureRedirect: '/login',access_type:"offline" }),
    function(req, res) {

        // Authenticated successfully


            res.redirect("/app")
    });

router.get("/api/cal",function (req,res) {
    const calendar = google.calendar({version: 'v3'});
    calendar.events.list({
        auth: auths[req.session.id],
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, response) => {
        if (err) return console.log('The API returned error: ' + err);
        const events = response.data.items;

            if (response.data.summary == req.user.email) {
                res.send(events)
            } else{
                res.redirect("/auth/google")

            }



    })

})


var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


/* GET users listing. */
router.post('/register', function(req, res){

    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });

    try {

      User.createUser(newUser, function (err, user) {
        if (err){ throw err}
        else {
            req.login(user, function (err) {
            if (err){throw err}
            return res.redirect("/app")
            })
        }


      });
    } catch (e) {
      console.log(e)
    }

});

router.post('/login', passport.authenticate('local'),
    function(req, res) {
        res.redirect("/app")
    }
);
router.get('/login',function (req,res) {
    res.render("login", {locals:{user:req.user}})
});

// Endpoint to get current user
router.get('/user',authenticationMiddleware(), function(req, res){
    res.send(req.user);

})


// Endpoint to logout
router.get('/logout', function(req, res){
    req.logout();
    res.redirect("login")
});

function authenticationMiddleware () {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/users/login')
    }
}


module.exports = router;

