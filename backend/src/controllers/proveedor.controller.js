const Proveedor = require("../models/Proveedor.model");

// Crear
const crearProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.create(req.body);
        res.status(201).json(proveedor);
    } catch (error) {
        res.status(500).json({ message: "Error al crear proveedor", error });
    }
};

// Listar todos
const listarProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.findAll();
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener proveedores", error });
    }
};

// Obtener uno
const obtenerProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.findByPk(req.params.id);

        if (!proveedor) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }

        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener proveedor", error });
    }
};

// Actualizar
const actualizarProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.findByPk(req.params.id);

        if (!proveedor) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }

        await proveedor.update(req.body);
        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar proveedor", error });
    }
};

// Eliminar
const deleteProveedor = async (req, res) => {
  try {
    const resultado = await Proveedor.destroy({
      where: { id: req.params.id }
    });

    if (resultado === 0) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error eliminando proveedor:", error);
    res.status(500).json({ error: "Error eliminando proveedor" });
  }
};
module.exports = {
    crearProveedor,
    listarProveedores,
    obtenerProveedor,
    actualizarProveedor,
    deleteProveedor
};
