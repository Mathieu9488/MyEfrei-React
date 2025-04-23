const express = require('express');
const router = express.Router();
const { getNotesByMatiere, addOrUpdateNote, deleteNote } = require('../../controllers/prof/notes.js');

router.get('/matiere/:matiereId', getNotesByMatiere);
router.post('/matiere/:matiereId', addOrUpdateNote);
router.delete('/:noteId', deleteNote);

module.exports = router;