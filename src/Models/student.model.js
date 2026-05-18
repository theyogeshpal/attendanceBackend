const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    deviceId: {
        type: String,
        default: null
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        default: null
    },
    degree: {
        type: String,
        default: ""
    },
    year: {
        type: String,
        default: ""
    },
    rollNumber: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
