const express = require('express');
const { startBatch, endBatch, getActiveBatches, getTeacherBatches } = require('../Controllers/batch.controller');

const router = Router = express.Router();

router.post('/start', startBatch);
router.post('/end', endBatch);
router.get('/active', getActiveBatches);
router.get('/teacher/:teacherId', getTeacherBatches);

module.exports = router;
