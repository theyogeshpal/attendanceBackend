const express = require('express');
const cors = require('cors');
const app = express();

const teacherRoute = require('./Routes/teacher.routes');
const authRoute = require('./Routes/auth.routes');
const batchRoute = require('./Routes/batch.routes');
const attendanceRoute = require('./Routes/attendance.routes');

// Enable CORS for frontend clients
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Secure Geo-Fenced Attendance System API working...");
});

// Setup API routes
app.use('/api/teacher', teacherRoute);
app.use('/api/auth', authRoute);
app.use('/api/batch', batchRoute);
app.use('/api/attendance', attendanceRoute);

module.exports = app;