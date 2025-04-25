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

  const updateClass = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ error: 'Le nom de la classe est requis' });
    }
  
    try {
      const classResult = await pool.query('SELECT * FROM classes WHERE id = $1', [id]);
      
      if (classResult.rowCount === 0) {
        return res.status(404).json({ error: 'Classe non trouvée' });
      }
  
      const updatedClassResult = await pool.query(
        'UPDATE classes SET name = $1 WHERE id = $2 RETURNING *',
        [name, id]
      );
  
      res.status(200).json(updatedClassResult.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la classe:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la classe' });
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

  module.exports = { getClasses, addClass, updateClass, getElevesByClassId };