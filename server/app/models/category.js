var mongoose = require('mongoose');
 
//#1 create schema
var Schema = mongoose.Schema;

var Categoryschema = Schema({
    name:{
        type:String,
        unique:true,
        lowercase:true
    }
});

//#2 create model
module.exports = mongoose.model('Category',Categoryschema);

