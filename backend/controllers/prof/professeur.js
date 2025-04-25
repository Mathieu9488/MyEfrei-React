const pool = require('../../db');

const getProfesseurProfile = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Récupération des informations de base du professeur
    const profResult = await pool.query(
      'SELECT id, name, firstname FROM professeurs WHERE id = $1', 
      [id]
    );
    
    if (profResult.rowCount === 0) {
      return res.status(404).json({ error: 'Professeur non trouvé' });
    }
    
    const prof = profResult.rows[0];
    
    // Récupération des matières enseignées par le professeur
    const matieresResult = await pool.query(
      'SELECT m.id, m.name, c.id as classe_id, c.name as classe_name ' +
      'FROM matieres m ' +
      'LEFT JOIN classes c ON m.classe_id = c.id ' +
      'WHERE m.professeur_id = $1',
      [id]
    );
    
    // Récupération des cours/sessions du professeur
    const coursResult = await pool.query(
      'SELECT s.id, s.date, s.start_time, s.end_time, m.id as matiere_id, m.name as matiere_name, ' +
      'c.id as classe_id, c.name as classe_name, s.salle ' +
      'FROM sessions s ' +
      'JOIN matieres m ON s.matieres_id = m.id ' +
      'LEFT JOIN classes c ON m.classe_id = c.id ' +
      'WHERE m.professeur_id = $1 ' +
      'ORDER BY s.date, s.start_time',
      [id]
    );
    
    // Organisation des sessions par date pour faciliter l'affichage dans le planning
    const sessionsByDate = {};
    coursResult.rows.forEach(cours => {
      const dateStr = new Date(cours.date).toISOString().split('T')[0];
      if (!sessionsByDate[dateStr]) {
        sessionsByDate[dateStr] = [];
      }
      
      sessionsByDate[dateStr].push({
        id: cours.id,
        start_time: cours.start_time,
        end_time: cours.end_time,
        salle: cours.salle,
        matiere: {
          id: cours.matiere_id,
          name: cours.matiere_name
        },
        classe: cours.classe_id ? {
          id: cours.classe_id,
          name: cours.classe_name
        } : null
      });
    });
    
    const response = {
      professeur: prof,
      matieres: matieresResult.rows,
      emploiDuTemps: sessionsByDate
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des informations du professeur' });
  }
};

module.exports = {
  getProfesseurProfile
};