var mongoose = require('mongoose');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var PortalSchema = mongoose.Schema({

    PortalName:{
        type:String
        index: true
    },
    PortalPassword:{
        type:String
    },
    TTL:{
        type:Number
    },
    Message: {
        type: String,

    }
});

var Portal = module.exports = mongoose.model('Portal', PortalSchema);


module.exports.createPortal= function(newPortal,callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newPortal.pPassword, salt, function(err, hash) {

            newPortal.pPassword = hash;

            db.collection('portals').insertOne({

                PortalName: newPortal.pName,
                PortalPassword: newPortal.pPassword,
                TTL: newPortal.ttl,
                Message: newPortal.message

            }, function (err, result) {
                assert.equal(err, null);
                console.log("Inserted a document into the restaurants collection.");
                callback();
            });

            // newPortal.save(callback);

        });
    });
};
