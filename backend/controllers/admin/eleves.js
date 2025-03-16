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
    const result = await pool.query('SELECT * FROM eleves WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'élève' });
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