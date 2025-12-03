const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send({ message: "No se proveyó un token." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ message: "No autorizado. Token inválido." });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role; 
    next();
  });
};

// Solo Dueños
const isDueno = (req, res, next) => {
  console.log("ROL DEL TOKEN:", req.userRole);
  if (req.userRole !== "DUEÑO") {
    return res.status(403).send({ message: "Acceso permitido solo a Dueños" });
  }
  next();
};

// Dueños o Cajas(Empleados)
const isCaja = (req, res, next) => {
  if (req.userRole !== "EMPLEADO" && req.userRole !== "DUEÑO") {
    return res
      .status(403)
      .send({ message: "Acceso permitido solo a Empleados o Dueños" });
  }
  next();
};

module.exports = { verifyToken, isDueno, isCaja };
