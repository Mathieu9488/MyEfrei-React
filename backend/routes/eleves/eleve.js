const express = require('express');
const router = express.Router();
const { getEleveProfile, getEleveAllMatieres } = require('../../controllers/eleve/eleve');

router.get('/:id', getEleveProfile);
router.get('/:id/all-matieres', getEleveAllMatieres);

module.exports = router;