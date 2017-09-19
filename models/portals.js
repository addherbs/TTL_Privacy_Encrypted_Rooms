var mongoose = require('mongoose');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var PortalSchema = mongoose.Schema({

    PortalName:{
        type:String,
        index: true
    },
    PortalPassword:{
        type:String
    },
    TTL:{
        type:Number
    },
    Message: {
        type: String
    }
});

var Portal = module.exports = mongoose.model('Portal', PortalSchema);


module.exports.createPortal= function(newPortal,callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newPortal.PortalPassword, salt, function(err, hash) {

            newPortal.PortalPassword = hash;

            db.collection('portals').insertOne(
                newPortal       //This is the object, we can also insert in a jason format..
                , function (err, result) {
                assert.equal(err, null);
                console.log("Inserted a document into the Portals collection.");
                callback();
            });
            // newPortal.save(callback);

        });
    });
};

module.exports.getPortals = function (callback) {

    //mongoose get all docs. I think here answers your question directly
    Portal.find(function (err, results) {
        if (err) {
            console.log("An error has occured. Abort everything!");
            callback(err);
        }
        assert.equal(null, err);

        callback(null, results);
    });
};