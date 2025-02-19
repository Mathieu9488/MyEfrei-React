const express = require("express");
const router = express.Router();
const  { getEleves, addEleve, addEleveList, deleteEleve, deleteEleveList, updateEleve, getEleveById, loginEleve } = require('../controllers/eleves.js')

router.get("/", getEleves);
router.post("/", addEleve);
router.post("/list", addEleveList);
router.delete("/", deleteEleve);
router.delete("/list", deleteEleveList);
router.patch("/:id", updateEleve);
router.get("/:id", getEleveById);
router.post("/login", loginEleve);

module.exports = router;
