const express = require("express");
const router = express.Router();
const { getProfs } = require('../../controllers/admin/professeurs.js');

router.get("/", getProfs);

module.exports = router;