const pool = require('../../db');

const getClasses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM classes');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des classes' });
  }
};

const addClass = async (req, res) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name required.' });
    }
  
    try {
      const newClassResult = await pool.query(
        'INSERT INTO classes (name) VALUES ($1) RETURNING *',
        [name]
      );
      const newClass = newClassResult.rows[0];
      res.status(201).json(newClass);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'ajout de la classe' });
    }
  };

  const getElevesByClassId = async (req, res) => {
    const { id } = req.params;
    try {
      const classResult = await pool.query('SELECT * FROM classes WHERE id = $1', [id]);
      if (classResult.rowCount === 0) {
        return res.status(404).json({ error: 'Classe non trouvée' });
      }
      const className = classResult.rows[0].name;
  
      const result = await pool.query(
        'SELECT e.id, e.name, e.firstname FROM eleves e WHERE e.classe_id = $1',
        [id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Aucun élève trouvé pour cette classe' });
      }
      res.status(200).json({ className, students: result.rows });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des élèves de la classe' });
    }
  };

module.exports = { getClasses, addClass, getElevesByClassId };