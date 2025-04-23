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
   
    const response = {
      eleve: {
        ...eleve,
        classe: {
          id: classe_id,
          name: classeName
        }
      },
      emploiDuTemps: sessionsByDate
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des informations de l\'élève' });
  }
};

module.exports = {
  getEleveProfile
};