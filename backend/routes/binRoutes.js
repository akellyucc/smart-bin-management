

const express = require('express');
const router = express.Router();
const binController = require('../controllers/binController');

router.post('/bins', binController.createBin);
router.get('/bins/totalBinsMonitored', binController.getTotalBinsMonitored);

router.get('/bins/:id', binController.getBinById);
// Define routes for bin operations
router.get('/bins', binController.getAllBins);

router.put('/bins/:id', binController.updateBin);
router.delete('/bins/:id', binController.deleteBin);
module.exports = router;
