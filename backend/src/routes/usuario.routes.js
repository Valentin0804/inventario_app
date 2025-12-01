const express = require('express');
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");

const { verifyToken, isDueno } = require('../middlewares/auth.middleware');

// Obtener todos los usuarios (solo dueño)
router.get('/', [verifyToken, isDueno], usuarioController.getAllUsers);

// Crear subcuenta (solo dueño)
router.post('/subcuenta', [verifyToken, isDueno], usuarioController.createSubaccount);

// Actualizar usuario (solo dueño)
router.put('/:id', [verifyToken, isDueno], usuarioController.updateUser);

// Eliminar usuario (solo dueño)
router.delete('/:id', [verifyToken, isDueno], usuarioController.deleteUser);

module.exports = router;
