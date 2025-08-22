const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // El token vendrá en la cabecera 'Authorization' como 'Bearer <token>'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).send({ message: "No se proveyó un token." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "No autorizado. Token inválido." });
    }
    // Si el token es válido, guardamos el ID del usuario en el objeto 'request'
    req.userId = decoded.id;
    next(); // Permite que la petición continúe hacia el controlador
  });
};

module.exports = { verifyToken };