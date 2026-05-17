const express = require('express')
const { 
    TeacherRegister, 
    TeacherDelete, 
    UpdateProfile, 
    ResetStudentDevice, 
    GetAllStudents 
} = require('../Controllers/teacher.controller');

const router = express.Router();

router.post("/register", TeacherRegister);
router.delete("/delete", TeacherDelete);

// Profile & Student management routes
router.put("/profile", UpdateProfile);
router.put("/reset-device", ResetStudentDevice);
router.get("/students", GetAllStudents);

module.exports = router