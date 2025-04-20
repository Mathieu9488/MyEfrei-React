const express = require('express');
const router = express.Router();
const { getProfs, getProfById, createProf, updateProf, deleteProf } = require('../../controllers/admin/professeurs.js');

router.get('/', getProfs);
router.get('/:id', getProfById);
router.post('/', createProf);
router.patch('/:id', updateProf);
router.delete('/:id', deleteProf);

module.exports = router;