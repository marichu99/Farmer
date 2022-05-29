const mongoose =require('mongoose');
// get the schema
const Schema = mongoose.Schema;
//schematize
const chunkSchema2= new Schema({
    type:{
       required:true,
       type:String 
    },
    quantity:{
       required:true,
       type:String
    },
    description:{
        required:true,
        type:String
    }
},{timestamps:true});
var Chunk2 = mongoose.model('Guy',chunkSchema2);
module.exports=Chunk2;