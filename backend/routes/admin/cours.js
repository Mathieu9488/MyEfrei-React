const express = require("express");
const router = express.Router();
const { getCours, addCour } = require('../../controllers/admin/cours.js');

router.get("/", getCours);
router.post("/", addCour);

module.exports = router;