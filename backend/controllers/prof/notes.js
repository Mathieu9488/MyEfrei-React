const pool = require('../../db');

const getNotesByMatiere = async (req, res) => {
  const { matiereId } = req.params;
  const { professorId } = req.query;
  
  try {
    const matiereResult = await pool.query(
      'SELECT * FROM matieres WHERE id = $1 AND professeur_id = $2',
      [matiereId, professorId]
    );
    
    if (matiereResult.rowCount === 0) {
      return res.status(403).json({ 
        error: 'Vous n\'êtes pas autorisé à accéder aux notes de cette matière' 
      });
    }
    
    const elevesResult = await pool.query(
      'SELECT e.id, e.name, e.firstname ' +
      'FROM eleves e ' +
      'JOIN matieres m ON e.classe_id = m.classe_id ' +
      'WHERE m.id = $1 ' +
      'ORDER BY e.name, e.firstname',
      [matiereId]
    );
    
    const notesResult = await pool.query(
      'SELECT n.id, n.eleve_id, n.note ' +
      'FROM notes n ' +
      'WHERE n.matieres_id = $1',
      [matiereId]
    );
    
    const notesMap = {};
    notesResult.rows.forEach(note => {
      notesMap[note.eleve_id] = note;
    });
    
    const resultData = elevesResult.rows.map(eleve => ({
      id: eleve.id,
      name: eleve.name,
      firstname: eleve.firstname,
      note: notesMap[eleve.id] ? notesMap[eleve.id].note : null,
      note_id: notesMap[eleve.id] ? notesMap[eleve.id].id : null
    }));
    
    res.json({
      matiere: matiereResult.rows[0],
      eleves: resultData
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des notes' });
  }
};

const addOrUpdateNote = async (req, res) => {
  const { matiereId } = req.params;
  const { professorId, eleveId, note } = req.body;
  
  if (!eleveId || note === undefined || note < 0 || note > 20) {
    return res.status(400).json({ error: 'Données invalides pour la note' });
  }
  
  try {
    const matiereResult = await pool.query(
      'SELECT * FROM matieres WHERE id = $1 AND professeur_id = $2',
      [matiereId, professorId]
    );
    
    if (matiereResult.rowCount === 0) {
      return res.status(403).json({ 
        error: 'Vous n\'êtes pas autorisé à modifier les notes de cette matière' 
      });
    }
    
    const eleveResult = await pool.query(
      'SELECT e.* FROM eleves e ' +
      'JOIN matieres m ON e.classe_id = m.classe_id ' +
      'WHERE e.id = $1 AND m.id = $2',
      [eleveId, matiereId]
    );
    
    if (eleveResult.rowCount === 0) {
      return res.status(404).json({ error: 'Élève non trouvé dans cette classe' });
    }
    
    const existingNoteResult = await pool.query(
      'SELECT * FROM notes WHERE eleve_id = $1 AND matieres_id = $2',
      [eleveId, matiereId]
    );
    
    let result;
    if (existingNoteResult.rowCount > 0) {
      result = await pool.query(
        'UPDATE notes SET note = $1 WHERE id = $2 RETURNING *',
        [note, existingNoteResult.rows[0].id]
      );
    } else {
      result = await pool.query(
        'INSERT INTO notes (eleve_id, matieres_id, note) VALUES ($1, $2, $3) RETURNING *',
        [eleveId, matiereId, note]
      );
    }
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de l\'ajout/mise à jour de la note:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout/mise à jour de la note' });
  }
};

const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const { professorId } = req.body;
  
  try {
    const noteResult = await pool.query(
      'SELECT n.*, m.professeur_id FROM notes n ' +
      'JOIN matieres m ON n.matieres_id = m.id ' +
      'WHERE n.id = $1',
      [noteId]
    );
    
    if (noteResult.rowCount === 0) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }
    
    if (noteResult.rows[0].professeur_id !== professorId) {
      return res.status(403).json({ 
        error: 'Vous n\'êtes pas autorisé à supprimer cette note' 
      });
    }
    
    await pool.query('DELETE FROM notes WHERE id = $1', [noteId]);
    
    res.json({ message: 'Note supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la note:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la note' });
  }
};

module.exports = {
  getNotesByMatiere,
  addOrUpdateNote,
  deleteNote
};