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
    },
    Count: {
        type: Number
    },
    Owner_ID: {
        type: String
    }
});

var Portal = module.exports = mongoose.model('Portal', PortalSchema);

module.exports.createPortal= function(newPortal,callback) {
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
            console.log("An error has occurred. Abort everything!");
            callback(err);
        }
        assert.equal(null, err);

        callback(null, results);
    });
};


// module.exports.getPortalByID = function (id,callback) {
//     //Get a portal with a specific id, if not, error is returned
//     db.collection('portals').find(
//         id //This is the object in json format..
//         , function (err, result) {
//             assert.equal(err, null);
//             console.log("Got the document");
//             console.log(result);
//             callback(result);
//         });
// };

module.exports.getPortalByID = function (id,callback) {

    db.collection('portals', function (err, collection) {
        if (!err) {
            collection.find(
                id
            ).toArray(function(err, docs) {
                if (!err) {
                    console.log("No error while retrieving ");
                    console.log(docs);
                    callback(docs);
                }});
        }
    });
};