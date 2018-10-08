const jwt = require("jsonwebtoken");

// ===============================
// Verificar Token
// ===============================

const tokenVerify = (req, res, next) => {
  let token = req.get("token");
  jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
    if (err)
      res.status(401).json({
        error: true,
        data: err
      });
    req.user = decoded.user; // coloca el user en el req
    next();
  });
};

const adminVerify = (req, res, next) => {
  let user = req.user; // viene del middleware anterior
  if (user.role === "ADMIN_ROLE") {
    next();
  } else
    res.status(401).json({
      error: true,
      data: {},
      msg: "Necesitas rol de Administrador"
    });
};

module.exports = {
  tokenVerify,
  adminVerify
};
