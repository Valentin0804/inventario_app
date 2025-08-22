const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');

// Esta ruta está protegida. Solo usuarios con un token válido pueden acceder.
router.get('/summary', [verifyToken], dashboardController.getSummary);

module.exports = router;