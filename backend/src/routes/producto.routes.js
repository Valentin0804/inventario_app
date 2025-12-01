const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const productoController = require("../controllers/producto.controller");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardan
  },
  filename: (req, file, cb) => {
    // Genera un nombre único: timestamp + extensión original
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.post(
  "/",
  verifyToken,
  upload.single("imagen"),
  productoController.createProducto
);
router.get("/", verifyToken, productoController.getAllProductos);
router.get("/:id", verifyToken, productoController.getProductoById);
router.put(
  "/:id",
  verifyToken,
  upload.single("imagen"),
  productoController.updateProducto
);
router.delete("/:id", verifyToken, productoController.deleteProducto);

module.exports = router;
