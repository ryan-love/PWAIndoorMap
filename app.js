var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('./model/user')
var es6Renderer = require('express-es6-template-engine')
var app = express();




app.engine('html', es6Renderer);
app.set('views', 'public');
app.set('view engine', 'html');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var calanderRouter = require("./routes/cal")
var calRouter = require("./routes/calandar");




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

try  {

    var mongo = 'mongodb://localhost/project-users'
    mongoose.connect(mongo,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true} )

    var db = mongoose.connection
    console.log("Working")
}catch(error){
    handleError(error)
    db.on("error", console.error.bind(console,"MongoDB Connection Error:"))

}

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/cal",calanderRouter);
app.use("/calandar",calRouter)





module.exports = app;
