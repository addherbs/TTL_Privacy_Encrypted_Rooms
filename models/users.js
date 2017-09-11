var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var UserSchema= mongoose.Schema({
    FirstName: {
        type: String,
        index: true
    },
    UserName:{
        type:String
    },
    EmailID:{
        type:String
    },
    Password:{
        type:String
    }
});


var User = module.exports = mongoose.model('User', UserSchema);


module.exports.createUser= function(newUser,callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.Password, salt, function(err, hash) {
            newUser.Password= hash;
            newUser.save(callback);
        });
    });
};

module.exports.comparePassword= function(userPassword,hash, callback){
    bcrypt.compare(userPassword, hash, function(err, isMatch){
        if(err) {
            console.log(userPassword);
            console.log(isMatch);
            throw err;
        }
        callback(null, isMatch);
    });
};

module.exports.getUserByUsername= function(username,callback){
    var query={ UserName: username};
    User.findOne(query, callback);
};

module.exports.getUserById= function(id,callback){
    User.findById(id, callback);
};

