const db = require("../models");
const Categoria = db.Categoria;

// Crear
const createCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.create(req.body);
    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ message: "Error al crear categoría", error });
  }
};

// Listar
const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener categorías", error });
  }
};

// Obtener por ID
const getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener categoría", error });
  }
};

// Actualizar
const updateCategoria = async (req, res) => {
  try {
    const [updated] = await Categoria.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const categoria = await Categoria.findByPk(req.params.id);
      return res.status(200).json(categoria);
    }
    throw new Error("Categoría no encontrada");
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar categoría", error });
  }
};

// Eliminar
const deleteCategoria = async (req, res) => {
  try {
    const deleted = await Categoria.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.status(204).send();
    }
    throw new Error("Categoría no encontrada");
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar categoría", error });
  }
};

module.exports = {
  createCategoria,
  getCategorias,
  getCategoriaById,
  updateCategoria,
  deleteCategoria
};
