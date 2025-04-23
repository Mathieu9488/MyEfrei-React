const express = require('express');
const router = express.Router();
const { getNotesByMatiere, addNote, updateNote, deleteNote } = require('../../controllers/prof/notes.js');

router.get('/matiere/:matiereId', getNotesByMatiere);
router.post('/matiere/:matiereId', addNote);
router.patch('/:noteId', updateNote);
router.delete('/:noteId', deleteNote);

module.exports = router;