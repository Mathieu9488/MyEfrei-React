const pool = require('../../db');
const bcrypt = require('bcryptjs');

const getProfs = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, firstname FROM professeurs');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des professeurs' });
  }
};

const getProfById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const profResult = await pool.query('SELECT id, name, firstname FROM professeurs WHERE id = $1', [id]);
    
    if (profResult.rows.length === 0) {
      return res.status(404).json({ error: 'Professeur non trouvé' });
    }
    
    const prof = profResult.rows[0];
    
    const matieresResult = await pool.query(
      'SELECT m.id, m.name, c.id as classe_id, c.name as classe_name ' +
      'FROM matieres m ' +
      'LEFT JOIN classes c ON m.classe_id = c.id ' +
      'WHERE m.professeur_id = $1',
      [id]
    );
    
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
    
    const response = {
      ...prof,
      matieres: matieresResult.rows,
      cours: coursResult.rows
    };
    
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération du professeur' });
  }
};

const createProf = async (req, res) => {
  const { name, firstname, password } = req.body;
  
  if (!name || !firstname || !password) {
    return res.status(400).json({ error: 'Nom, prénom et mot de passe sont requis' });
  }
  
  try {
    const existingProf = await pool.query(
      'SELECT * FROM professeurs WHERE name = $1 AND firstname = $2',
      [name, firstname]
    );
    
    if (existingProf.rows.length > 0) {
      return res.status(409).json({ error: 'Un professeur avec ce nom et prénom existe déjà' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const result = await pool.query(
      'INSERT INTO professeurs (name, firstname, password) VALUES ($1, $2, $3) RETURNING id, name, firstname',
      [name, firstname, hashedPassword]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du professeur' });
  }
};

const updateProf = async (req, res) => {
  const { id } = req.params;
  const { name, firstname, password, matieres } = req.body;
  
  try {
    const profResult = await pool.query('SELECT * FROM professeurs WHERE id = $1', [id]);
    
    if (profResult.rows.length === 0) {
      return res.status(404).json({ error: 'Professeur non trouvé' });
    }
    
    const prof = profResult.rows[0];
    
    const updates = {
      name: name !== undefined ? name : prof.name,
      firstname: firstname !== undefined ? firstname : prof.firstname,
    };
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }
    
    const updateResult = await pool.query(
      'UPDATE professeurs SET name = $1, firstname = $2' + 
      (password ? ', password = $3' : '') + 
      ' WHERE id = $' + (password ? '5' : '3') + 
      ' RETURNING id, name, firstname',
      password 
        ? [updates.name, updates.firstname, updates.password, id]
        : [updates.name, updates.firstname, id]
    );
    
    if (matieres && Array.isArray(matieres)) {
      const currentMatieresResult = await pool.query(
        'SELECT id FROM matieres WHERE professeur_id = $1',
        [id]
      );
      
      const currentMatieres = currentMatieresResult.rows.map(row => row.id);
      
      for (const matiereId of matieres) {
        if (!currentMatieres.includes(matiereId)) {
          const matiereExists = await pool.query('SELECT id FROM matieres WHERE id = $1', [matiereId]);
          
          if (matiereExists.rows.length > 0) {
            await pool.query(
              'UPDATE matieres SET professeur_id = $1 WHERE id = $2',
              [id, matiereId]
            );
          }
        }
      }
      
      for (const currentMatiereId of currentMatieres) {
        if (!matieres.includes(currentMatiereId)) {
          await pool.query(
            'UPDATE matieres SET professeur_id = NULL WHERE id = $1',
            [currentMatiereId]
          );
        }
      }
    }
    
    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du professeur' });
  }
};

const deleteProf = async (req, res) => {
  const { id } = req.params;
  
  try {
    const profResult = await pool.query('SELECT * FROM professeurs WHERE id = $1', [id]);
    
    if (profResult.rows.length === 0) {
      return res.status(404).json({ error: 'Professeur non trouvé' });
    }
    
    await pool.query('UPDATE matieres SET professeur_id = NULL WHERE professeur_id = $1', [id]);
    
    await pool.query('DELETE FROM professeurs WHERE id = $1', [id]);
    
    res.json({ message: 'Professeur supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du professeur' });
  }
};

module.exports = { 
  getProfs, 
  getProfById, 
  createProf, 
  updateProf, 
  deleteProf 
};