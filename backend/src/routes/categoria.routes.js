const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const categoriaController = require("../controllers/categoria.controller");

router.post("/", verifyToken, categoriaController.createCategoria);
router.get("/", verifyToken, categoriaController.getCategorias);
router.get("/:id", verifyToken, categoriaController.getCategoriaById);
router.put("/:id", verifyToken, categoriaController.updateCategoria);
router.delete("/:id", verifyToken, categoriaController.deleteCategoria);

module.exports = router;
