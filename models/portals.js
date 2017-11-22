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
    },
    createdAt:  {
        type: Date, default: Date.now
    },
    expireAt: {
        type: Date, default: undefined
    }
});

PortalSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 });

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

module.exports.comparePassword= function(portalPassword,hash, callback){
    bcrypt.compare(portalPassword, hash, function(err, isMatch){
        // console.log("Into the compare passwords");
        // console.log("portal password: "+ portalPassword);
        // console.log("hash:  "+hash);
        if(err) {
            // console.log("Compare methods with error !!!");
            console.log(isMatch);
            throw err;
        }
        // console.log("Match Happened");
        callback(null, isMatch);
    });
};

module.exports.getPortalByPortalID= function(portalID,callback){
    console.log("Into the getPortalByPortalID "+ portalID);
    var query   =   {
        _id : portalID
    };
    console.log("This is the query )" );
    console.log(query);
    console.log("================================");
    db.collection('portals').find(query, callback);
};

module.exports.updatePortalByID = function(check,data,callback){

    console.log("===============updatePortalByID =================");
    console.log(check);
    console.log(data);
    console.log("================updatePortalByID ================");
    db.collection("portals").updateOne(check,data, function(err, res) {
        if (err) {
            console.log("Error came while updating");
            callback("Error came while updating");

        }else{
            console.log("Document Updated");
            callback(null, res);
        }
    });
};

module.exports.removePortal = function (query, callback) {

    console.log("===============removePortal =================");
    console.log(query);
    console.log("===============removePortal =================");

    db.collection("portals").remove(query, function(err, obj) {
        if (err){
            console.log("Error while removing the portal");
            callback("\"Error Report to callback\"");
            throw err;
        }
        console.log(obj.result.n + " document(s) deleted");
        callback(null, "document deleted");
    });
};
