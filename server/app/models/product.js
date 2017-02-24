var mongoose = require('mongoose');
//#1 create schema
var Schema = mongoose.Schema;

var schema = Schema({
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category'
    },
    name:String,
    price:Number,
    image:String
});

//#2 create model
module.exports=mongoose.model('Product',schema);
