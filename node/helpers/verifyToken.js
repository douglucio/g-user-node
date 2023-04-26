require('dotenv').config()
const jwt = require("jsonwebtoken");

// Middleware para verificar se o token é válido
function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token não fornecido!" });

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) return res.status(403).json({ message: "Token inválido!" });
        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;