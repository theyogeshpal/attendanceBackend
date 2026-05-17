const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique: true
    },
    password : {
        type : String,
        required : true
    },
    name : {
        type : String,
        default : ""
    },
    mobile : {
        type : String,
        default : ""
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model("Teacher", teacherSchema);