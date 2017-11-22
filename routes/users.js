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
    var str= Object.keys(req.body);
    str = JSON.parse(str);
    console.log(str);

    // console.log("---------------");
    // var str= JSON.parse(str);
    // console.log(str);
    // console.log("---------------");

    var portalName = str.PortalName;
    var portalPass = str["PortalPassword"];
    var portalTTL = str.TTL;
    var portalMessage = str.Message;

    console.log("Portal Name:"+ portalName + "\nPortal Password:"+portalPass +"\nTTL: "+"- "+ portalTTL +
        "\nMessage:" + portalMessage );
    console.log('clickedPortal is ends');
    console.log('---------------------\n');
    try {
        console.log('mkc bc execute ho');
        res.send(str);
        // res.redirect('/users/hereYourHaveClicked');

    }catch(err){
        console.log(err);
    }
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
            var listOfAllPortals;
            listOfAllPortals = portals;
            // console.log("Check starts ------------------");
            // //console.log(listOfAllPortals);
            // console.log("Check Ends ------------------");
            res.render('showPortals', {portals:listOfAllPortals});
        });
    }
});

router.post('/generatePortalsByID', function (req, res) {

    var data = JSON.stringify(req.body);

    var obj = JSON.parse(data);
    var keys = Object.keys(obj);
    var check = keys[0];

    Portal.getPortals(function (err, portals) {
        var finalPortals = [];
        if (err) throw err;
        for (var key in portals) {
            if (portals.hasOwnProperty(key)) {
                if (check === portals[key].Owner_ID) {
                    // var currentPortal = portals[key];
                    // console.log(portals[key]);
                    // var temp = {
                    //     PortalName: currentPortal.PortalName,
                    //     TTL: currentPortal.TTL,
                    //     Message: currentPortal.Message,
                    //     Count: currentPortal.Count
                    // };
                    finalPortals.push(portals[key]);
                }
            }
        }

        res.send(JSON.stringify(finalPortals));
    });
});



// refresh button which button is pressed
router.post('/refreshPortalList', function (req,res) {
    console.log('Refresh portal was clicked!!');
    Portal.getPortals(function(err, portals){
        console.log('Here I am dude');
        if (err) throw err;
        res.render('showPortals', {portals:portals});
    });
});


router.post('/eachPortalInputData', function (req,res) {
    console.log("reached eachPortalInputData");
    var formData = req.body.formatDate();
    console.log(formData);
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
    var owner_id = req.body.owner_id;

    var cpPassword = req.body.cpPassword;

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
    req.checkBody('cpPassword', 'Confirm Portal Password should match Portal Password').notEmpty().equals(req.body.pPassword);

    var portalData = {
        PortalName: pName,
        PortalPassword: pPassword,
        TTL: ttl,
        Message: message,
        Count: count,
        Owner_ID: owner_id
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


router.post('/checkUpdate', function (req,res) {

    var portalID = "5a11a3885363fa51343cdb8c";
    var check = {
        PortalName : "lol",
        Message : "lol"
    };

    var data = {
        $set :{
            PortalName : "lol1",
            PortalPassword : "$2a$10$w.IEAt0NO1jSdXNfw5XWx.Fsaee/h9BHfDaz8ov0XX680tb7VYm9a",
            TTL : 13,
            Message : "lol",
            Count : 5,
            Owner_ID : "59b10cd8b14c7f20d44f9884"
        }
    };

    Portal.updatePortalByID(check,data, function (err, result) {
        if (err) {
            console.log(err);
            console.log("updatePortalByID Error");
        }
        if (result){
            console.log(result);
            console.log("updatePortalByID Updated");
        }
    });
});


router.post('/validatePortalJoinData', function (req,res) {

    console.log('Validate Portal Begins===============');
    var data = JSON.stringify(req.body);
    var output = {

    };

    var obj = JSON.parse(data);
    var keys = Object.keys(obj);

    var portalName = obj[keys[0]];
    var portalPassword = obj[keys[1]];
    var portalID = obj[keys[2]];
    var user_id = obj[keys[3]];

    // portalID =  'ObjectId("' + portalID + '")';

    validatePortalOpen(portalID, portalPassword, function (err, returnValue) {
        if (err) {
            console.log(err);
            res.send(err);
        }else {
            console.log("Portal data is returned");

            updateCount(returnValue, function (err, updatedCount) {
                if (err) {
                    console.log(err);
                    console.log("UpdateCount Error");
                }if(updatedCount){
                    console.log('Update Count Success');

                    checkCountIfZero(returnValue, function (err, returnResult) {

                    });


                }
            });

            console.log('===============Validate Portal Ends');
            output = {
                'portalName' : returnValue.PortalName,
                'portalID': returnValue._id,
                'owner_id': returnValue.Owner_ID,
                'TTL': returnValue.TTL,
                'Message': returnValue.Message
            };
            res.send(output);
        }

    });
});

function checkCountIfZero(getResult, callback) {

    console.log("Starting the checkCountIfZero");
    console.log(getResult);

    if(getResult.Count - 1 === 0 ){
        console.log("Updated Count has reached 0");
        console.log("We have to delete the portal since the count is reached 0")

        var check = {
            PortalName : getResult.PortalName,
            Message : getResult.Message
        };
        Portal.removePortal(check, function (err, returnRes) {

            if (err){
                console.log("Couldn't Delete the file");
            }
            if(returnRes){
                console.log("Portal Deleted yaaaayyyyy");
            }



        });

    }else{
        console.log("Updated Count is not 0");

    }
    console.log("Ending the checkCountIfZero");
}


function updateCount(currentPortal, callback) {

    console.log(currentPortal);
    var currentPortalCount = currentPortal.Count -1;
    console.log(currentPortalCount);

    var check = {
        PortalName : currentPortal.PortalName,
        Message : currentPortal.Message
    };

    var data = {
        $set :{
            Count: currentPortalCount
        }
    };

    Portal.updatePortalByID(check,data, function (err, result) {
        if (err) {
            console.log("Error while updating count: ", err);
            callback("Error while updating count: ");
        }
        if (result){
            console.log("Success while updating count: ", result);
            callback(null, result);
        }
    });

}

function validatePortalOpen(portalID, portalPassword, callback) {

    Portal.getPortals(function(err, portals){
        if (err) throw err;
        portals = portals.filter(function (portal) {
            return ( portal._id ).toString() === (portalID);
        });
        Portal.comparePassword(portalPassword, portals[0].PortalPassword, function (err, isMatch) {
            if (err) {
                console.log("Exception");
                throw err;
            }
            if (isMatch) {
                console.log("Match done!!!");
                callback(null, portals[0]);
            }
            else {
                console.log("Wrong match");
                callback("Wrong match Passes");
            }
        });
    });
}

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