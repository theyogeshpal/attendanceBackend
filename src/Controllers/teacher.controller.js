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

// Teacher Profile Update
const UpdateProfile = async (req, res) => {
    try {
        const { teacherId, name, email, mobile } = req.body;

        if (!teacherId) {
            return res.status(400).json({ message: "teacherId is required" });
        }

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Email duplicate check
        if (email && email !== teacher.email) {
            const emailExists = await Teacher.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email is already in use by another teacher" });
            }
            teacher.email = email;
        }

        teacher.name = name;
        if (mobile !== undefined) {
            teacher.mobile = mobile;
        }

        await teacher.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: teacher._id,
                email: teacher.email,
                name: teacher.name,
                mobile: teacher.mobile
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Reset Student Device ID (Teacher Override)
const Student = require('../Models/student.model');

const ResetStudentDevice = async (req, res) => {
    try {
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(400).json({ message: "studentId is required" });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        student.deviceId = null;
        await student.save();

        return res.status(200).json({
            message: "Student device ID reset successfully.",
            student
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Enrolled Students (with their batch name)
const GetAllStudents = async (req, res) => {
    try {
        const students = await Student.find({}).populate('batchId', 'batchName');
        return res.status(200).json({ students });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    TeacherRegister, 
    TeacherDelete,
    UpdateProfile,
    ResetStudentDevice,
    GetAllStudents
}