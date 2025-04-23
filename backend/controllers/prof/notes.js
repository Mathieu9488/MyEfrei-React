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
      'SELECT n.id, n.eleve_id, n.note, n.coefficient, n.description, n.date ' +
      'FROM notes n ' +
      'WHERE n.matieres_id = $1 ' +
      'ORDER BY n.eleve_id, n.date',
      [matiereId]
    );
    
    const notesMap = {};
    notesResult.rows.forEach(note => {
      if (!notesMap[note.eleve_id]) {
        notesMap[note.eleve_id] = [];
      }
      notesMap[note.eleve_id].push({
        id: note.id,
        note: note.note,
        coefficient: note.coefficient || 1,
        description: note.description || '',
        date: note.date
      });
    });
    
    const resultData = elevesResult.rows.map(eleve => {
      const notes = notesMap[eleve.id] || [];
      let moyenne = null;
      
      if (notes.length > 0) {
        let somme = 0;
        let totalCoeff = 0;
        notes.forEach(note => {
          somme += note.note * note.coefficient;
          totalCoeff += note.coefficient;
        });
        moyenne = totalCoeff > 0 ? (somme / totalCoeff).toFixed(2) : null;
      }
      
      return {
        id: eleve.id,
        name: eleve.name,
        firstname: eleve.firstname,
        notes: notes,
        moyenne: moyenne
      };
    });
    
    res.json({
      matiere: matiereResult.rows[0],
      eleves: resultData
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des notes' });
  }
};

const addNote = async (req, res) => {
  const { matiereId } = req.params;
  const { professorId, eleveId, note, coefficient, description } = req.body;
  
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
    
    const result = await pool.query(
      'INSERT INTO notes (eleve_id, matieres_id, note, coefficient, description, date) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE) RETURNING *',
      [eleveId, matiereId, note, coefficient || 1, description || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la note:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la note' });
  }
};

const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { professorId, note, coefficient, description } = req.body;
  
  if (note === undefined || note < 0 || note > 20) {
    return res.status(400).json({ error: 'Données invalides pour la note' });
  }
  
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
        error: 'Vous n\'êtes pas autorisé à modifier cette note' 
      });
    }
    
    const result = await pool.query(
      'UPDATE notes SET note = $1, coefficient = $2, description = $3 WHERE id = $4 RETURNING *',
      [note, coefficient || 1, description, noteId]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la note:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la note' });
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
  addNote,
  updateNote,
  deleteNote
};