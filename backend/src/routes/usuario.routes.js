const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");

const { verifyToken, isDueno } = require("../middlewares/auth.middleware");

router.get("/", [verifyToken, isDueno], usuarioController.getAllUsers);
router.post(
  "/subcuenta",
  [verifyToken, isDueno],
  usuarioController.createSubaccount
);
router.put("/:id", [verifyToken, isDueno], usuarioController.updateUser);
router.delete("/:id", [verifyToken, isDueno], usuarioController.deleteUser);
module.exports = router;
