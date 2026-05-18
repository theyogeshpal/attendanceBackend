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
    batchIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch'
    }],
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
    },
    branch: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
