const mongoose= require('mongoose');
//create a schema
const Schema=mongoose.Schema;
// schematize
const chunkSchema= new Schema({
   
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

},{timestamps:true});

var Chunk3 = mongoose.model('farmer',chunkSchema);
module.exports=Chunk3;
