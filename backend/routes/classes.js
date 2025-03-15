const express = require("express");
const router = express.Router();
const { getClasses, addClass, getElevesByClassId } = require('../controllers/classes.js');

router.get("/", getClasses);
router.post("/", addClass);
router.get("/:id", getElevesByClassId);

module.exports = router;