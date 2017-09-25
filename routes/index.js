var express = require('express');
var router = express.Router();

router.get('/', ensureAuthentication,function (req,res) {
    res.render('index');
});

function ensureAuthentication(req,res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    else {
        req.flash('error_msg', 'Login First');
        res.redirect('/users/login');
    }
}


module.exports = router;