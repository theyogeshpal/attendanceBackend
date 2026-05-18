const express = require('express');
const { studentRegister, studentLogin, teacherLogin, updateStudentProfile } = require('../Controllers/auth.controller');

const router = express.Router();

// Student Routes
router.post('/register', studentRegister);
router.post('/login', studentLogin);
router.put('/student/profile', updateStudentProfile);

// Teacher Route
router.post('/teacher', teacherLogin);

module.exports = router;