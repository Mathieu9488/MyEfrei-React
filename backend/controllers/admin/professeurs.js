const pool = require('../../db');

const getProfs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM professeurs');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des professeurs' });
  }
};

module.exports = { getProfs };