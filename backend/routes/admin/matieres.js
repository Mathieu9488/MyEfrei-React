const express = require("express");
const router = express.Router();
const { getMatieres, addMatiere, deleteMatiere, updateMatiere, getMatiereDetails } = require('../../controllers/admin/matieres.js');

router.get("/", getMatieres);
router.post("/", addMatiere);
router.delete("/:id", deleteMatiere);
router.patch("/:id", updateMatiere);
router.get("/:id", getMatiereDetails);

module.exports = router;