const express = require('express');
const { startBatch, endBatch, getActiveBatches } = require('../Controllers/batch.controller');

const router = express.Router();

router.post('/start', startBatch);
router.post('/end', endBatch);
router.get('/active', getActiveBatches);

module.exports = router;
