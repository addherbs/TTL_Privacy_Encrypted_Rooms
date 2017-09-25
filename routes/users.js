var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Portal = require('../models/portals');
var User = require('../models/users');


// register route
router.get('/register', function (req,res) {
    res.render('register');
});


// login route
router.get('/login', function (req,res) {
    res.render('login');
});


router.post('/clickedPortal', function (req,res) {
    var str= req.body;

    var portalName = str.PortalName;
    var portalPass = str["PortalPassword"];
    var portalTTL = str.TTL;
    var portalMessage = str.Message;


    console.log("Portal Name:"+ portalName + "\nPortal Password:"+portalPass +"\nTTL: "+"- "+ portalTTL +
        "\nMessage:" + portalMessage );

    console.log('clickedPortal is ends\n');
    console.log('---------------------');

    res.render('portalData');
});

// verify which button is pressed
router.post('/twoButton', function (req,res) {

        req.body = JSON.parse(JSON.stringify(req.body));
        if(req.body.hasOwnProperty('createPortal')){
            console.log('create portal was clicked!!');
            res.render('createPortal');
        }else{
            console.log('Show portal was clicked!!');

                Portal.getPortals(function(err, portals){
                if (err) throw err;
                var listOfAllPortals = portals;

                // console.log("Check starts ------------------");
                // //console.log(listOfAllPortals);
                // console.log("Check Ends ------------------");

                res.render('showPortals', {portals:listOfAllPortals});
            });

        }
});


// Create a portal
router.post('/createPortal', function (req,res) {
    var pName = req.body.pName;
    var pPassword = req.body.pPassword;
    var hours = req.body.hours;
    var mins = req.body.mins;
    var secs = req.body.secs;
    var message = req.body.message;
    var count = req.body.count;
    var ttl = hours*3600 + mins*60 + secs;
    console.log("Portal Name:"+ pName + "\nPortal Password:"+pPassword +"\nHours-Mins-Secs: "+ hours +"-" +mins+ "-"+ secs +
        "\nMessage:" + message + "\nTotal TTL: "+ ttl + "\t count: " + count);


    //Validation of form
    req.checkBody('pName', 'Portal Name is required').notEmpty();
    req.checkBody('pPassword', 'Portal Password is required').notEmpty();
    req.checkBody('hours', 'Hours is required/ Otherwise enter 0').notEmpty();
    req.checkBody('mins', 'Minutes is required/ Otherwise enter 0').notEmpty();
    req.checkBody('secs', 'Seconds is required/ Otherwise enter 0').notEmpty();
    req.checkBody('message', 'There has to be a message').notEmpty();
    req.checkBody('count', 'You have to enter open count/ Atleast 1').notEmpty();

    var portalData = {
        PortalName: pName,
        PortalPassword: pPassword,
        TTL: ttl,
        Message: message,
        Count: count
    };

    var errors= req.validationErrors();
    if(errors){
        res.render('createPortal',{
            errors:errors
        });
    }else{
        var newPortal = new Portal(portalData);

        Portal.createPortal(newPortal, function(err, portal){
            if (err) throw err;
            //console.log(portal);
        });

        req.flash('success_msg', 'You have successfully created a portal.. Inform your friend to check');

        res.redirect('/');
    }

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