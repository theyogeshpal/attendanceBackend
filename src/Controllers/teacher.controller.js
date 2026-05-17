const mongoose = require('mongoose')
const Teacher = require('../Models/teacher.model');
const teacherModel = require('../Models/teacher.model');
const bcrypt = require('bcryptjs')

const TeacherRegister = async (req, res) => {

    try{
        const {email, password} = req.body;

        //for checking whether this email is already registered or not
        const teacher = await Teacher.findOne({email})
            
        if(teacher){
            return res.status(400).json({message : "Email Already Registered"})
        }

        //hashing password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const NewTeacher = new Teacher({
            email:email,
            password:hash
        })


        //for creating new teacher account if the email is not already registered
        await NewTeacher.save()
            .then(data => res.status(200).json(data))
            .catch(error => res.status(500).json({message: error}))

    }
    catch(err){
        console.log(err)
    }

}

const TeacherDelete = async (req, res) => {
    const {email} = req.body;

    try{
        await Teacher.findOneAndDelete({email});
        return res.status(200).json({message : "Deleted Successfully"})
    }
    catch(err){
        console.log(err);
    }

}


module.exports = {TeacherRegister, TeacherDelete}