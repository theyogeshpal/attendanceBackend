const Student = require('../Models/student.model');
const Teacher = require('../Models/teacher.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secure_geofenced_attendance_secret_key';

// Student Registration
const studentRegister = async (req, res) => {
    try {
        const { name, mobile, password, batchId } = req.body;

        if (!name || !mobile) {
            return res.status(400).json({ message: "Name and Mobile are required" });
        }

        // Check if student already exists
        const exist = await Student.findOne({ mobile });
        if (exist) {
            return res.status(400).json({ message: "Mobile number already registered" });
        }

        // Determine password: if not provided, default to student@{mobile}
        const studentPassword = password || `student@${mobile}`;

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(studentPassword, salt);

        const newStudent = new Student({
            name,
            mobile,
            password: hashedPassword,
            batchId: batchId || null
        });

        const savedStudent = await newStudent.save();
        
        // Remove password from response
        const studentResponse = savedStudent.toObject();
        delete studentResponse.password;

        return res.status(201).json({
            message: "Student registered successfully",
            student: studentResponse
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Student Login (with Device Binding)
const studentLogin = async (req, res) => {
    try {
        const { mobile, password, deviceId } = req.body;

        if (!mobile || !password) {
            return res.status(400).json({ message: "Mobile number and password are required" });
        }

        // Find Student
        const student = await Student.findOne({ mobile });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Verify password
        const isPasswordCorrect = bcrypt.compareSync(password, student.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Handle Device Binding
        if (deviceId) {
            if (!student.deviceId) {
                // Check if device is already registered by another student
                const existingBinding = await Student.findOne({ deviceId, _id: { $ne: student._id } });
                if (existingBinding) {
                    return res.status(400).json({
                        message: "Device registration failed! This device is already bound to another student."
                    });
                }
                // First-time login: Bind device
                student.deviceId = deviceId;
                await student.save();
            } else if (student.deviceId !== deviceId) {
                // Device mismatch: Prevent login (anti-proxy feature)
                return res.status(403).json({ 
                    message: "Device mismatch! This account is bound to another device." 
                });
            }
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: student._id, role: 'student', name: student.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Prepare response
        const studentResponse = student.toObject();
        delete studentResponse.password;

        return res.status(200).json({
            message: "Student logged in successfully",
            token,
            user: studentResponse
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Teacher Login
const teacherLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fix: Use findOne instead of find, which returned an array
        const teacher = await Teacher.findOne({ email });

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const correct = bcrypt.compareSync(password, teacher.password);

        if (!correct) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: teacher._id, role: 'teacher', email: teacher.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({ 
            message: "Login successful",
            token,
            user: {
                id: teacher._id,
                email: teacher.email
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    studentRegister,
    studentLogin,
    teacherLogin,
    JWT_SECRET
};