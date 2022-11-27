var express = require('express');
var cors = require("cors")
var passport = require('passport');
var User = require('../model/user')
var router = express.Router();



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

router.get('/app',isLog,cors(),function(req, res) {
  res.render('app');
});

function isLog(req,res,next){
  if(req.isAuthenticated()){
    return next()
    console.log(req.isAuthenticated)
  }
  else{
    return res.redirect("/")
  }
}

router.get("/",function (req,res) {
  console.log(req.session);
  if (req.isAuthenticated()) {

    res.render("app")
  } else {
    res.render("login")

  }

})









module.exports = router;