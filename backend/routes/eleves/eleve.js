const express = require('express');
const router = express.Router();
const { getEleveProfile } = require('../../controllers/eleve/eleve.js');

router.get('/:id', getEleveProfile);

module.exports = router;