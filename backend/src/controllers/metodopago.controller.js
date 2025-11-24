const db = require("../models");
const MetodoPago = db.MetodoPago;

// Crear
const createMetodoPago = async (req, res) => {
  try {
    const metodo = await MetodoPago.create(req.body);
    res.status(201).json(metodo);
  } catch (error) {
    res.status(500).json({ message: "Error al crear método de pago", error });
  }
};

// Listar
const getMetodosPago = async (req, res) => {
  try {
    const metodos = await MetodoPago.findAll();
    res.status(200).json(metodos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener métodos de pago", error });
  }
};

// Obtener por ID
const getMetodoPagoById = async (req, res) => {
  try {
    const metodo = await MetodoPago.findByPk(req.params.id);
    if (!metodo) {
      return res.status(404).json({ message: "Método de pago no encontrado" });
    }
    res.status(200).json(metodo);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener método de pago", error });
  }
};

// Actualizar
const updateMetodoPago = async (req, res) => {
  try {
    const [updated] = await MetodoPago.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const metodo = await MetodoPago.findByPk(req.params.id);
      return res.status(200).json(metodo);
    }
    throw new Error("Método de pago no encontrado");
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar método de pago", error });
  }
};

// Eliminar
const deleteMetodoPago = async (req, res) => {
  try {
    const deleted = await MetodoPago.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.status(204).send();
    }
    throw new Error("Método de pago no encontrado");
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar método de pago", error });
  }
};

module.exports = {
  createMetodoPago,
  getMetodosPago,
  getMetodoPagoById,
  updateMetodoPago,
  deleteMetodoPago
};
