const Batch = require('../Models/batch.model');

// Start a batch (Teacher marks active location and enables attendance)
const startBatch = async (req, res) => {
    try {
        const { batchName, teacherId, teacherLat, teacherLon } = req.body;

        if (!batchName || !teacherId || teacherLat === undefined || teacherLon === undefined) {
            return res.status(400).json({ message: "batchName, teacherId, teacherLat, and teacherLon are required" });
        }

        // Find existing batch or create a new one
        let batch = await Batch.findOne({ batchName, teacherId });

        if (batch) {
            batch.status = 'active';
            batch.teacherLat = parseFloat(teacherLat);
            batch.teacherLon = parseFloat(teacherLon);
            await batch.save();
        } else {
            batch = new Batch({
                batchName,
                teacherId,
                status: 'active',
                teacherLat: parseFloat(teacherLat),
                teacherLon: parseFloat(teacherLon)
            });
            await batch.save();
        }

        return res.status(200).json({
            message: "Batch started successfully",
            batch
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// End a batch (Teacher disables attendance for this class)
const endBatch = async (req, res) => {
    try {
        const { batchId } = req.body;

        if (!batchId) {
            return res.status(400).json({ message: "batchId is required" });
        }

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        batch.status = 'inactive';
        await batch.save();

        return res.status(200).json({
            message: "Batch ended successfully",
            batch
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get all active batches (helps student UI list what classes are currently available to mark attendance)
const getActiveBatches = async (req, res) => {
    try {
        const activeBatches = await Batch.find({ status: 'active' }).populate('teacherId', 'email');
        return res.status(200).json({
            batches: activeBatches
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    startBatch,
    endBatch,
    getActiveBatches
};
