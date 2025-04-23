const express = require('express');
const router = express.Router();
const { getProfesseurProfile } = require('../../controllers/prof/professeur.js');

router.get('/:id', getProfesseurProfile);

module.exports = router;