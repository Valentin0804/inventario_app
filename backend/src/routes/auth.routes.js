const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

// Definimos la ruta para el registro
// Cuando llegue una petición POST a '/api/auth/registro',
// se ejecutará la función 'register' del controlador.
router.post('/registro', authController.register);

router.post('/login', authController.login);



module.exports = router;