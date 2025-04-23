const pool = require('../../db');

const getEleveProfile = async (req, res) => {
  const { id } = req.params;
  
  try {
    const eleveResult = await pool.query('SELECT id, name, firstname, classe_id FROM eleves WHERE id = $1', [id]);
    
    if (eleveResult.rowCount === 0) {
      return res.status(404).json({ error: 'Élève non trouvé' });
    }
    
    const eleve = eleveResult.rows[0];
    const classe_id = eleve.classe_id;
    
    const classeResult = await pool.query('SELECT name FROM classes WHERE id = $1', [classe_id]);
    const classeName = classeResult.rowCount > 0 ? classeResult.rows[0].name : null;
    
    const emploiDuTempsQuery = `
      SELECT 
        s.id as session_id, 
        s.date, 
        s.start_time, 
        s.end_time, 
        s.salle,
        m.id as matiere_id, 
        m.name as matiere_name,
        p.id as professeur_id, 
        p.name as professeur_name, 
        p.firstname as professeur_firstname
      FROM sessions s
      JOIN matieres m ON s.matieres_id = m.id
      LEFT JOIN professeurs p ON m.professeur_id = p.id
      WHERE m.classe_id = $1
      ORDER BY s.date, s.start_time
    `;
    
    const emploiDuTempsResult = await pool.query(emploiDuTempsQuery, [classe_id]);
    
    const sessionsByDate = {};
    emploiDuTempsResult.rows.forEach(session => {
      const dateStr = new Date(session.date).toISOString().split('T')[0];
      if (!sessionsByDate[dateStr]) {
        sessionsByDate[dateStr] = [];
      }
      sessionsByDate[dateStr].push({
        id: session.session_id,
        start_time: session.start_time,
        end_time: session.end_time,
        salle: session.salle,
        matiere: {
          id: session.matiere_id,
          name: session.matiere_name
        },
        professeur: session.professeur_id ? {
          id: session.professeur_id,
          name: session.professeur_name,
          firstname: session.professeur_firstname
        } : null
      });
    });

    const notesQuery = `
      SELECT 
        n.id, 
        n.note,
        n.coefficient,
        n.description,
        n.date, 
        m.id as matiere_id, 
        m.name as matiere_name,
        p.id as professeur_id,
        p.name as professeur_name,
        p.firstname as professeur_firstname
      FROM notes n
      JOIN matieres m ON n.matieres_id = m.id
      LEFT JOIN professeurs p ON m.professeur_id = p.id
      WHERE n.eleve_id = $1
      ORDER BY m.name, n.date DESC
    `;
    
    const notesResult = await pool.query(notesQuery, [id]);
    
    const notesByMatiere = {};
    let sommeGeneraleCoef = 0;
    let sommeGeneraleNotesCoef = 0;
    
    notesResult.rows.forEach(note => {
      const matiereId = note.matiere_id;
      if (!notesByMatiere[matiereId]) {
        notesByMatiere[matiereId] = {
          matiere: {
            id: note.matiere_id,
            name: note.matiere_name
          },
          professeur: note.professeur_id ? {
            id: note.professeur_id,
            name: note.professeur_name,
            firstname: note.professeur_firstname
          } : null,
          notes: [],
          sommeCoef: 0,
          sommeNotesCoef: 0
        };
      }
      
      const coef = note.coefficient || 1;
      
      notesByMatiere[matiereId].notes.push({
        id: note.id,
        note: note.note,
        coefficient: coef,
        description: note.description || '',
        date: note.date
      });
      
      notesByMatiere[matiereId].sommeCoef += coef;
      notesByMatiere[matiereId].sommeNotesCoef += note.note * coef;
      
      sommeGeneraleCoef += coef;
      sommeGeneraleNotesCoef += note.note * coef;
    });
    
    const notesAvecMoyennes = Object.values(notesByMatiere).map(matiere => {
      const moyenne = matiere.sommeCoef > 0 
        ? (matiere.sommeNotesCoef / matiere.sommeCoef).toFixed(2) 
        : null;
      
      const { sommeCoef, sommeNotesCoef, ...matiereFinale } = matiere;
      
      return {
        ...matiereFinale,
        moyenne
      };
    });
    
    const moyenneGenerale = sommeGeneraleCoef > 0 
      ? (sommeGeneraleNotesCoef / sommeGeneraleCoef).toFixed(2) 
      : null;
   
    const response = {
      eleve: {
        ...eleve,
        classe: {
          id: classe_id,
          name: classeName
        }
      },
      emploiDuTemps: sessionsByDate,
      notes: notesAvecMoyennes,
      moyenneGenerale
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des informations de l\'élève' });
  }
};

const getEleveAllMatieres = async (req, res) => {
  const { id } = req.params;
  
  try {
    const eleveResult = await pool.query('SELECT id, name, firstname, classe_id FROM eleves WHERE id = $1', [id]);
    
    if (eleveResult.rowCount === 0) {
      return res.status(404).json({ error: 'Élève non trouvé' });
    }
    
    const notesQuery = `
      SELECT 
        n.id, 
        n.note,
        n.coefficient,
        n.description,
        n.date, 
        m.id as matiere_id, 
        m.name as matiere_name,
        p.id as professeur_id,
        p.name as professeur_name,
        p.firstname as professeur_firstname
      FROM notes n
      JOIN matieres m ON n.matieres_id = m.id
      LEFT JOIN professeurs p ON m.professeur_id = p.id
      WHERE n.eleve_id = $1
      ORDER BY m.name, n.date DESC
    `;
    
    const notesResult = await pool.query(notesQuery, [id]);
    
    const matieresQuery = `
      SELECT 
        m.id as matiere_id, 
        m.name as matiere_name,
        p.id as professeur_id,
        p.name as professeur_name,
        p.firstname as professeur_firstname
      FROM matieres m
      LEFT JOIN professeurs p ON m.professeur_id = p.id
      WHERE m.classe_id = (SELECT classe_id FROM eleves WHERE id = $1)
      ORDER BY m.name
    `;
    
    const matieresResult = await pool.query(matieresQuery, [id]);
    
    const notesByMatiere = {};
    
    matieresResult.rows.forEach(matiere => {
      const matiereId = matiere.matiere_id;
      notesByMatiere[matiereId] = {
        matiere: {
          id: matiere.matiere_id,
          name: matiere.matiere_name
        },
        professeur: matiere.professeur_id ? {
          id: matiere.professeur_id,
          name: matiere.professeur_name,
          firstname: matiere.professeur_firstname
        } : null,
        notes: []
      };
    });
    
    notesResult.rows.forEach(note => {
      const matiereId = note.matiere_id;
      
      if (!notesByMatiere[matiereId]) {
        notesByMatiere[matiereId] = {
          matiere: {
            id: note.matiere_id,
            name: note.matiere_name
          },
          professeur: note.professeur_id ? {
            id: note.professeur_id,
            name: note.professeur_name,
            firstname: note.professeur_firstname
          } : null,
          notes: []
        };
      }
      
      notesByMatiere[matiereId].notes.push({
        id: note.id,
        note: note.note,
        coefficient: note.coefficient || 1,
        description: note.description || '',
        date: note.date
      });
    });
    
    const matieres = Object.values(notesByMatiere);
    
    res.status(200).json({ matieres });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des matières et notes de l\'élève' });
  }
};

module.exports = {
  getEleveProfile,
  getEleveAllMatieres
};