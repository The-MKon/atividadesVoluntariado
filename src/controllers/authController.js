const jwt = require("jsonwebtoken");
const config = require("../config")
const DataBase = require("../database/index");
const db = new DataBase("usuarios");


exports.registrarUsuario = (req, res) => {
    const { email, senha } = req.body;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email inválido" });
    }

    if (senha.length < 6) {
        return res.status(400).json({ message: "A senha deve ter pelo menos 6 caracteres" });
    }

    db.get("admin", (err, adminValue) => {
        if (err || !adminValue) {
            const adminUsuario = { email: "admin@admin.com", senha: "admin123", tipo: "admin" };

            db.put("admin", JSON.stringify(adminUsuario), (err) => {
                if (err) {
                    return res.status(500).json({ message: "Erro ao criar usuário admin" });
                }

                db.put(adminUsuario.email, JSON.stringify(adminUsuario), (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Erro ao registrar o admin no banco" });
                    }

                    const novoUsuario = { email, senha, tipo: "comum" };
                    db.put(email, JSON.stringify(novoUsuario), (err) => {
                        if (err) {
                            return res.status(500).json({ message: "Erro ao registrar o usuário comum" });
                        }
                        res.status(201).json({ message: "Usuário admin e usuário comum registrados com sucesso!" });
                    });
                });
            });
        } else {
            const novoUsuario = { email, senha, tipo: "comum" };
            db.put(email, JSON.stringify(novoUsuario), (err) => {
                if (err) {
                    return res.status(500).json({ message: "Ocorreu um erro ao registrar usuário" });
                }
                res.status(201).json({ message: "Usuário registrado com sucesso" });
            });
        }
    });
}

exports.logarUsuario = (req, res) => {
    const { email, senha } = req.body;

    db.get(email, (err, value) => {
        if (err && !value) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const usuario = JSON.parse(value);
        if (usuario.senha !== senha) {
            return res.status(401).json({ message: "Senha inválida" });
        }

        const token = jwt.sign({ email, tipo: usuario.tipo }, config.SECRET_KEY, { expiresIn: "1h" });
        res.json({ message: "Login bem-sucedido", token });
    })
}