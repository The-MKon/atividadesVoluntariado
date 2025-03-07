const express = require("express");
const router = express.Router();
const atividadeController = require("../controllers/atividadeController");
const {ehAdmin} = require("../middlewares/authMiddleware")

router.get("/", atividadeController.listarAtividades);
router.post("/", ehAdmin, atividadeController.criarAtividade);
router.get("/:id", ehAdmin, atividadeController.editarAtividade);
router.delete("/:id", ehAdmin, atividadeController.excluirAtividade);
router.get("/:id/participantes", ehAdmin, atividadeController.listarParticipantes);
router.post("/:id/inscrever", atividadeController.inscreverUsuario);
router.post("/:id/cancelar", atividadeController.cancelarInscricao);
router.get("/inscritas", atividadeController.listarAtividadesInscrito);

module.exports = router