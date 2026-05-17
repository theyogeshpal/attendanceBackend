const express = require('express');
const { markAttendance, getStudentHistory, getBatchHistory } = require('../Controllers/attendance.controller');

const router = express.Router();

router.post('/mark', markAttendance);
router.get('/student/:studentId', getStudentHistory);
router.get('/batch/:batchId', getBatchHistory);

module.exports = router;
