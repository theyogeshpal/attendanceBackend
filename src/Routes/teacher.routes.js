const express = require('express')
const { 
    TeacherRegister, 
    TeacherDelete, 
    UpdateProfile, 
    ResetStudentDevice, 
    GetAllStudents,
    GetStudentsByBatch,
    TeacherChangePassword,
    AddStudentToBatch
} = require('../Controllers/teacher.controller');

const router = express.Router();

router.post("/register", TeacherRegister);
router.delete("/delete", TeacherDelete);

// Profile & Student management routes
router.put("/profile", UpdateProfile);
router.put("/change-password", TeacherChangePassword);
router.put("/reset-device", ResetStudentDevice);
router.get("/students", GetAllStudents);

// Batch-wise enrolled student list (for batch attendance sheet)
router.get("/batch/:batchId/students", GetStudentsByBatch);
router.post("/batch/add-student", AddStudentToBatch);

module.exports = router