const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    batchName: {
        type: String,
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    teacherLat: {
        type: Number,
        default: 0
    },
    teacherLon: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);
