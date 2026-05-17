const express = require('express');
const { 
    markAttendance, 
    getStudentHistory, 
    getBatchHistory,
    getBatchAttendanceStats,
    getStudentMonthWiseStats
} = require('../Controllers/attendance.controller');

const router = express.Router();

router.post('/mark', markAttendance);
router.get('/student/:studentId', getStudentHistory);
router.get('/batch/:batchId', getBatchHistory);

// Stats routes
router.get('/stats/batch/:batchId', getBatchAttendanceStats);
router.get('/stats/student/:studentId', getStudentMonthWiseStats);

module.exports = router;
