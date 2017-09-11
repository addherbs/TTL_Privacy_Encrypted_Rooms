var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users');

// register route
router.get('/register', function (req,res) {
    res.render('register');
});

//login route
router.get('/login', function (req,res) {
    res.render('login');
});

router.post('/register', function (req,res) {

    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var cpassword = req.body.cpassword;
    var username = req.body.username;

    //Validation of form
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'EmailID is required').notEmpty();
    req.checkBody('email', 'Email is invalid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('cpassword', 'Passwords should match').equals(req.body.password);
    console.log(cpassword);

    var errors= req.validationErrors();
    if(errors){
        res.render('register',{
            errors:errors
        });
    }else{
        var newUser = new User({
            FirstName: name,
            UserName: username,
            EmailID: email,
            Password: password
        });


        User.createUser(newUser, function(err, user){
            if (err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are now registered.. Login to continue');

        res.redirect('/users/login');
    }

});


passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown user' });
            }
            User.comparePassword(password, user.Password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user );
                }
                else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});


router.post('/login',
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
    function(req, res) {
        res.redirect('/');
});


router.get('/logout', function (req,res) {
   req.logOut();

   req.flash('success_msg', 'You are logged out');

   res.redirect('/users/login');
});





module.exports = router;