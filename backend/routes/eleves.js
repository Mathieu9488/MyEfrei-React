const express = require("express");
const router = express.Router();
const  { getEleves, addEleve, deleteEleve, updateEleve, getEleveById, loginEleve } = require('../controllers/eleves.js')

router.get("/", getEleves);
router.post("/", addEleve);
router.delete("/", deleteEleve);
router.patch("/:id", updateEleve);
router.get("/:id", getEleveById);
router.post("/login", loginEleve);

module.exports = router;
