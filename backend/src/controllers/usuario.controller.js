const Usuario = require("../models/Usuario.model");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {
  try {
    const users = await Usuario.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo usuarios" });
  }
};

const createSubaccount = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);

    const nuevo = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || "EMPLEADO",
      owner_id: req.userId,
    });

    res.json(nuevo);
  } catch (err) {
    console.error("ERROR SUBCUENTA:", err);
    res.status(500).json({ message: "Error creando subcuenta" });
  }
};

const updateUser = async (req, res) => {
  try {
    await Usuario.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Usuario actualizado" });
  } catch (err) {
    res.status(500).json({ message: "Error actualizando usuario" });
  }
};

const deleteUser = async (req, res) => {
  try {
    await Usuario.destroy({ where: { id: req.params.id } });
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error eliminando usuario" });
  }
};

module.exports = {
  createSubaccount,
  deleteUser,
  updateUser,
  getAllUsers,
};
