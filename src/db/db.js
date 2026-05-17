const mongoose = require('mongoose')

const connectDB = () => {
    try{
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/attendanceSystem';
        mongoose.connect(mongoURI)
        console.log("mongoDB connected")
    }
    catch(Exception){
        console.log(Exception)
    }
}

module.exports = connectDB