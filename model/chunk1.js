const mongoose= require('mongoose');
//create a schema
const Schema=mongoose.Schema;
// schematize
const chunkSchema1= new Schema({
    
    type:{
        type:String,
        required:true
    },
    quantity:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }

},{timestamps:true});

var Chunk1 = mongoose.model('Friend',chunkSchema1);
module.exports=Chunk1;
