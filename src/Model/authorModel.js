const mongoose = require("mongoose")
const { required } = require("nodemon/lib/config")

const authorModel = new mongoose.Schema({
    fname: {
        type: String,
        required: 'First name is required',
        trim: true
    },
    lname: {
        type: String,
        required: 'Last name is required',
        trim: true
    },
    title: {
        type: String,
        required: 'Title is required',
        enum: ["Mr", "Mrs", "Miss"]
    },


    emailId: {
        type: String,
        trim:true,
        required: 'Email is required',
        unique: true,
        lowercase : true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'pls fill a valid email-id']
    },
    password: {
        type: String,
        required: 'Password is required',
        trim: true
    }


}, {timestamps:true})

module.exports = mongoose.model("Author", authorModel)