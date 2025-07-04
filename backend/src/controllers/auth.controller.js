// src/controllers/auth.controller.js
const bcrypt = require("bcrypt");
const { Usuario } = require("../models");

const register = async (req, res) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;

    // Validación básica
    if (!nombre || !email || !contraseña) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ error: "El email ya está registrado." });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear el usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      contraseña: hashedPassword,
      rol: rol || "empleado",
    });

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente.",
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

module.exports = { register };
