const jwt = require("jsonwebtoken");
const config = require("../config")

exports.autenticarToken = (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token não fornecido." });
    }
    jwt.verify(token, config.SECRET_KEY, (err, user) => { 
        if (err) {
            return res.status(403).json({ error: "Token inválido." });
        }
        req.user = user;
        next();
    })
}

exports.ehAdmin = (req, res, next) => {
    if (req.user.tipo !== "admin") {
        return res.status(403).json({ error: "Você não possui permissão para acessar esse recurso." });
    }
    next();
}