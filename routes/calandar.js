var express = require('express');
var router = express.Router();
const cors = require('cors')
var passport = require("passport")

function isLog(req,res,next){
    if(req.isAuthenticated()){
        return next()
        console.log(req.isAuthenticated)
    }
    else{
        return res.redirect("/users/auth/google")
    }
}

router.get("/",isLog,function (req,res) {
res.render("cal", {locals:{user:req.user}})
})

module.exports = router