const bcrypt = require('bcryptjs');
const pool = require('../../db');

const generateId = async () => {
  let id;
  let exists = true;
  while (exists) {
    id = Math.floor(10000000 + Math.random() * 90000000);
    const result = await pool.query('SELECT 1 FROM eleves WHERE id = $1', [id]);
    exists = result.rowCount > 0;
  }
  return id;
};

const getEleves = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM eleves');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des élèves' });
  }
};

const addEleve = async (req, res) => {
  const { name, firstname, classe_id, password } = req.body;

  if (!name || !firstname || !classe_id || !password) {
    return res.status(400).json({ error: 'Invalid input: missing fields' });
  }

  try {
    const id = await generateId();
    const hashedMdp = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO eleves (id, name, firstname, classe_id, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, name, firstname, classe_id, hashedMdp]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'élève' });
  }
};

const deleteEleve = async (req, res) => {
  const { id } = req.body;
  if (typeof id !== 'number') {
    return res.status(400).json({ error: 'Invalid input: id must be a number' });
  }

  try {
    const result = await pool.query('DELETE FROM eleves WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'élève' });
  }
};

const updateEleve = async (req, res) => {
  const { id } = req.params;
  const { name, firstname, classe_id, password } = req.body;

  try {
    const eleve = await pool.query('SELECT * FROM eleves WHERE id = $1', [id]);
    if (eleve.rowCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const updatedEleve = {
      name: name || eleve.rows[0].name,
      firstname: firstname || eleve.rows[0].firstname,
      classe_id: classe_id || eleve.rows[0].classe_id,
      password: password ? await bcrypt.hash(password, 10) : eleve.rows[0].password,
    };

    const result = await pool.query(
      'UPDATE eleves SET name = $1, firstname = $2, classe_id = $3, password = $4 WHERE id = $5 RETURNING *',
      [updatedEleve.name, updatedEleve.firstname, updatedEleve.classe_id, updatedEleve.password, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'élève' });
  }
};

const getEleveById = async (req, res) => {
  const { id } = req.params;
  try {
    const eleveResult = await pool.query('SELECT * FROM eleves WHERE id = $1', [id]);
    if (eleveResult.rowCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
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
    
    const { password: _, ...eleveWithoutPassword } = eleve;
    
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
        ...eleveWithoutPassword,
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
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'élève et de son emploi du temps' });
  }
};

const loginEleve = async (req, res) => {
  const { id, password } = req.body;

  if (typeof id !== 'number') {
    return res.status(400).json({ error: 'Invalid input: id must be a number' });
  }

  if (typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input: password must be a string' });
  }

  try {
    const result = await pool.query('SELECT * FROM eleves WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const eleve = result.rows[0];
    const match = await bcrypt.compare(password, eleve.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const { password: _, ...eleveWithoutPassword } = eleve;
    res.status(200).json({ message: 'Login successful', eleve: eleveWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la vérification du mot de passe' });
  }
};

module.exports = {
  getEleves,
  addEleve,
  deleteEleve,
  updateEleve,
  getEleveById,
  loginEleve
};