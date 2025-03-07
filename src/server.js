const express = require("express");
const app = express();

const atividadeRoutes = require("./routes/atividadeRoutes");
const authRoutes = require("./routes/authRoutes");
const {autenticarToken} = require("./middlewares/authMiddleware");
const config = require("./config");

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    
    next();
});

app.use("/auth", authRoutes);
app.use("/atividades", autenticarToken, atividadeRoutes);

app.listen(config.PORT, () => {
    console.log(`Servidor rodando na porta ${config.PORT}`);
});