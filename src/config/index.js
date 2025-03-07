require("dotenv").config();

const config = {
    PORT: process.env.PORT || 3000,
    SECRET_KEY: process.env.SECRET_KEY || "chave-padrao"
}

module.exports = config;