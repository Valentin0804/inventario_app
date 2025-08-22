const db = require("../models");
const Usuario = db.Usuario;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // <-- Asegúrate de que esta línea esté aquí

// Función de Registro
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).send({ message: "Todos los campos son requeridos." });
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
    });
    res.status(201).send({ message: "¡Usuario registrado con éxito!", usuario: nuevoUsuario });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).send({ message: "Error al registrar el usuario.", error: error.message });
  }
};

// Función de Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email: email } });
    if (!usuario) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const passwordIsValid = bcrypt.compareSync(password, usuario.password);
    if (!passwordIsValid) {
      return res.status(401).send({ accessToken: null, message: "¡Contraseña incorrecta!" });
    }

    // Aquí es donde se usaba la variable 'jwt' que no estaba definida
    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: 86400 }
    );

    res.status(200).send({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      accessToken: token
    });

  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).send({ message: "Error en el login.", error: error.message });
  }
};

// Exportamos ambas funciones
module.exports = {
  register,
  login
};