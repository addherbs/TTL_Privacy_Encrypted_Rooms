var mongoose = require('mongoose');

var PortalSchema= mongoose.Schema({

    UserName:{
        type:String
    },
    PortalName: {
        type: String,
        index: true
    },
    PortalPassword:{
        type:String
    },
    EmailID:{
        type:String
    }

});
