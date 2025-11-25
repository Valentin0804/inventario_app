const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');

router.get('/summary', [verifyToken], dashboardController.getSummary);

module.exports = router;