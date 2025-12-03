const express = require("express");
const router = express.Router();
const { verifyToken, isDueno } = require("../middlewares/auth.middleware");
const categoriaController = require("../controllers/categoria.controller");

router.post("/", verifyToken, isDueno,categoriaController.createCategoria);
router.get("/", verifyToken, isDueno, categoriaController.getCategorias);
router.get("/:id", verifyToken, isDueno ,categoriaController.getCategoriaById);
router.put("/:id", verifyToken, isDueno,categoriaController.updateCategoria);
router.delete("/:id", verifyToken, isDueno, categoriaController.deleteCategoria);

module.exports = router;
