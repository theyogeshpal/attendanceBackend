const express = require('express')
const {TeacherRegister,TeacherDelete} = require('../Controllers/teacher.controller');

const router = express.Router();

router.post("/register", TeacherRegister);

router.delete("/delete", TeacherDelete);


module.exports = router