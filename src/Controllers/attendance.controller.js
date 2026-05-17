const Attendance = require('../Models/attendance.model');
const Batch = require('../Models/batch.model');
const Student = require('../Models/student.model');

// Helper function to calculate distance using Haversine formula (in meters)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
};

// Mark Attendance
const markAttendance = async (req, res) => {
    try {
        const { 
            studentId, 
            batchId, 
            studentLat, 
            studentLon, 
            deviceId,
            isMocked, 
            isRooted, 
            isEmulator 
        } = req.body;

        // Basic verification
        if (!studentId || !batchId || studentLat === undefined || studentLon === undefined) {
            return res.status(400).json({ message: "studentId, batchId, studentLat, and studentLon are required" });
        }

        // 1. Anti-Cheat Security Checks (Mock Location, Root, Jailbreak, Emulator)
        if (isMocked) {
            return res.status(403).json({ 
                message: "Security Violation: Fake/Mock GPS detected! Attendance rejected." 
            });
        }
        if (isRooted) {
            return res.status(403).json({ 
                message: "Security Violation: Rooted/Jailbroken device detected! Attendance rejected." 
            });
        }
        if (isEmulator) {
            return res.status(403).json({ 
                message: "Security Violation: Emulator usage detected! Attendance rejected." 
            });
        }

        // 2. Fetch Student and verify Device Binding
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // If the student's deviceId is bound, ensure the incoming deviceId matches it
        if (student.deviceId && deviceId && student.deviceId !== deviceId) {
            return res.status(403).json({ 
                message: "Security Violation: Device ID mismatch! This account is bound to another hardware device." 
            });
        }

        // 3. Fetch Batch and check if it is active
        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        if (batch.status !== 'active') {
            return res.status(400).json({ 
                message: "Attendance session is currently closed for this batch." 
            });
        }

        // 4. Geo-fencing Validation (15 Meters check)
        const distance = calculateDistance(
            parseFloat(studentLat), 
            parseFloat(studentLon), 
            batch.teacherLat, 
            batch.teacherLon
        );

        console.log(`Student GPS: ${studentLat}, ${studentLon} | Teacher GPS: ${batch.teacherLat}, ${batch.teacherLon}`);
        console.log(`Calculated Distance: ${distance.toFixed(2)} meters`);

        if (distance > 15.0) {
            return res.status(403).json({ 
                message: `Out of Range! You are ${distance.toFixed(1)}m away. Attendance is allowed only within 15 meters.` 
            });
        }

        // 5. Check if already marked present
        const existingAttendance = await Attendance.findOne({ studentId, batchId });
        if (existingAttendance) {
            return res.status(400).json({ message: "Attendance already marked for this batch session." });
        }

        // 6. Save Attendance
        const attendance = new Attendance({
            studentId,
            batchId,
            status: 'present'
        });

        await attendance.save();

        // Also add details to student model list if needed, but since we have a dedicated collection, we're set!
        return res.status(200).json({
            message: "Attendance marked successfully! Status: PRESENT",
            attendance,
            distance: `${distance.toFixed(1)} meters`
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get Attendance History for a Student
const getStudentHistory = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId) {
            return res.status(400).json({ message: "studentId is required" });
        }

        const history = await Attendance.find({ studentId })
            .populate('batchId', 'batchName')
            .sort({ timestamp: -1 });

        return res.status(200).json({ history });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get Attendance History for a Batch (Teacher's view)
const getBatchHistory = async (req, res) => {
    try {
        const { batchId } = req.params;

        if (!batchId) {
            return res.status(400).json({ message: "batchId is required" });
        }

        const history = await Attendance.find({ batchId })
            .populate('studentId', 'name mobile')
            .sort({ timestamp: -1 });

        return res.status(200).json({ history });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    markAttendance,
    getStudentHistory,
    getBatchHistory
};
