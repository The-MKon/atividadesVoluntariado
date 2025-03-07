const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController")

router.post("/login", authController.logarUsuario);
router.post("/register", authController.registrarUsuario);

module.exports = router