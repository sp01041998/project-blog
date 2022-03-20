const { timeStamp } = require("console")
const mongoose = require("mongoose")
const { object } = require("webidl-conversions")
const ObjectId = mongoose.Schema.Types.ObjectId

const createBlog = new mongoose.Schema({
    title : {
        type : String,
        required : 'Blog title is required',
        trim : true
    },
    body : {
        type: String,
        required : "blog body is required",
        trim : true

    },
    authorId:{
        type : ObjectId,
        required : "Blog auhtor id is required",
        ref : "Author"
    },
    tags : {
        type : [{type : String, trim : true}]
    },
    category : {
        type : String,
        required : 'Blog category is reuired',
        trim : true

    },
    
    subCategory : {
        type : [{type : String, trim : true}]
    },
    isDeleted :{
        type : Boolean,
        default: false
    },

    deletedAt : {
        type: Date,
        default : null


   },
   isPublished : {
       type : Boolean,
       default : false
   },
   publishedAt : {
       type : Date,
       default: null
   }

}, {timestamps : true})

module.exports=mongoose.model("Blog", createBlog)