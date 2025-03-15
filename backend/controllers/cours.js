const pool = require('../db');

const getCours = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cours');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des cours' });
  }
};

const addCour = async (req, res) => {
  const { name, students } = req.body;
  if (!name || !Array.isArray(students)) {
    return res.status(400).json({ error: 'Name & list of students required.' });
  }

  try {
    const newClassResult = await pool.query(
      'INSERT INTO cours (name) VALUES ($1) RETURNING *',
      [name]
    );
    const newClass = newClassResult.rows[0];

    for (const studentId of students) {
      const studentResult = await pool.query(
        'SELECT * FROM eleves WHERE id = $1',
        [studentId]
      );
      const student = studentResult.rows[0];
      if (student) {
        await pool.query(
          'UPDATE eleves SET classe_id = $1 WHERE id = $2',
          [newClass.id, studentId]
        );
      } else {
        return res.status(404).json({ error: `ID student ${studentId} not found` });
      }
    }

    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du cours' });
  }
};

module.exports = { getCours, addCour };