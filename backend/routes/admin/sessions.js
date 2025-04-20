const express = require('express');
const router = express.Router();
const { 
  getSessions, 
  getSessionById, 
  addSession, 
  updateSession, 
  deleteSession 
} = require('../../controllers/admin/sessions.js');

router.get('/', getSessions);
router.get('/:id', getSessionById);
router.post('/', addSession);
router.patch('/:id', updateSession);
router.delete('/:id', deleteSession);

module.exports = router;