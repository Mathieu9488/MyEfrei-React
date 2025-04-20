const pool = require('../../db');

const getMatieres = async (req, res) => {
  try {
    const result = await pool.query('SELECT m.*, c.name as classe_name, p.name as professeur_name, p.firstname as professeur_firstname FROM matieres m LEFT JOIN classes c ON m.classe_id = c.id LEFT JOIN professeurs p ON m.professeur_id = p.id');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des matières' });
  }
};

const addMatiere = async (req, res) => {
  const { name, professeur_id, classe_id } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Le nom de la matière est requis' });
  }

  try {
    if (classe_id) {
      const classeResult = await pool.query('SELECT * FROM classes WHERE id = $1', [classe_id]);
      if (classeResult.rowCount === 0) {
        return res.status(404).json({ error: 'Classe non trouvée' });
      }
    }

    if (professeur_id) {
      const profResult = await pool.query('SELECT * FROM professeurs WHERE id = $1', [professeur_id]);
      if (profResult.rowCount === 0) {
        return res.status(404).json({ error: 'Professeur non trouvé' });
      }
    }

    const newMatiereResult = await pool.query(
      'INSERT INTO matieres (name, professeur_id, classe_id) VALUES ($1, $2, $3) RETURNING *',
      [name, professeur_id, classe_id]
    );
    
    const newMatiere = newMatiereResult.rows[0];
    res.status(201).json(newMatiere);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la matière' });
  }
};

const deleteMatiere = async (req, res) => {
  const { id } = req.params;
  
  try {
    const matiereResult = await pool.query('SELECT * FROM matieres WHERE id = $1', [id]);
    if (matiereResult.rowCount === 0) {
      return res.status(404).json({ error: 'Matière non trouvée' });
    }
    
    await pool.query('DELETE FROM notes WHERE matieres_id = $1', [id]);
    
    await pool.query('DELETE FROM sessions WHERE matieres_id = $1', [id]);
    
    await pool.query('DELETE FROM matieres WHERE id = $1', [id]);
    
    res.status(200).json({ message: 'Matière supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la matière' });
  }
};

const updateMatiere = async (req, res) => {
  const { id } = req.params;
  const { name, professeur_id, classe_id } = req.body;
  
  try {
    const matiereResult = await pool.query('SELECT * FROM matieres WHERE id = $1', [id]);
    if (matiereResult.rowCount === 0) {
      return res.status(404).json({ error: 'Matière non trouvée' });
    }
    
    const oldMatiere = matiereResult.rows[0];
    
    if (classe_id) {
      const classeResult = await pool.query('SELECT * FROM classes WHERE id = $1', [classe_id]);
      if (classeResult.rowCount === 0) {
        return res.status(404).json({ error: 'Classe non trouvée' });
      }
    }
    
    if (professeur_id) {
      const profResult = await pool.query('SELECT * FROM professeurs WHERE id = $1', [professeur_id]);
      if (profResult.rowCount === 0) {
        return res.status(404).json({ error: 'Professeur non trouvé' });
      }
    }
    
    const updatedMatiereResult = await pool.query(
      'UPDATE matieres SET name = $1, professeur_id = $2, classe_id = $3 WHERE id = $4 RETURNING *',
      [
        name || oldMatiere.name,
        professeur_id !== undefined ? professeur_id : oldMatiere.professeur_id,
        classe_id !== undefined ? classe_id : oldMatiere.classe_id,
        id
      ]
    );
    
    res.status(200).json(updatedMatiereResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la matière' });
  }
};

const getMatiereDetails = async (req, res) => {
  const { id } = req.params;
  
  try {
    const matiereResult = await pool.query(
      'SELECT m.*, c.name as classe_name, p.name as professeur_name, p.firstname as professeur_firstname ' +
      'FROM matieres m ' +
      'LEFT JOIN classes c ON m.classe_id = c.id ' +
      'LEFT JOIN professeurs p ON m.professeur_id = p.id ' +
      'WHERE m.id = $1',
      [id]
    );
    
    if (matiereResult.rowCount === 0) {
      return res.status(404).json({ error: 'Matière non trouvée' });
    }
    
    const matiere = matiereResult.rows[0];
    
    const elevesResult = await pool.query(
      'SELECT e.id, e.name, e.firstname FROM eleves e WHERE e.classe_id = $1',
      [matiere.classe_id]
    );
    
    const notesResult = await pool.query(
      'SELECT n.*, e.name as eleve_name, e.firstname as eleve_firstname ' +
      'FROM notes n ' +
      'JOIN eleves e ON n.eleve_id = e.id ' +
      'WHERE n.matieres_id = $1',
      [id]
    );
    
    const response = {
      matiere: {
        id: matiere.id,
        name: matiere.name,
        classe: {
          id: matiere.classe_id,
          name: matiere.classe_name
        },
        professeur: matiere.professeur_id ? {
          id: matiere.professeur_id,
          name: matiere.professeur_name,
          firstname: matiere.professeur_firstname
        } : null
      },
      etudiants: elevesResult.rows,
      notes: notesResult.rows
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des détails de la matière' });
  }
};

module.exports = { 
  getMatieres, 
  addMatiere, 
  deleteMatiere, 
  updateMatiere, 
  getMatiereDetails 
};