const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const loginUser = async (req, res) => {
  const { id, password } = req.body;

  if (typeof id !== 'number') {
    return res.status(400).json({ error: 'Invalid input: id must be a number' });
  }

  if (typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input: password must be a string' });
  }

  try {
    // Vérifier dans la table des élèves
    let result = await pool.query('SELECT * FROM eleves WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      // Si non trouvé, vérifier dans la table des admins
      result = await pool.query('SELECT * FROM admins WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        // Si non trouvé, vérifier dans la table des professeurs
        result = await pool.query('SELECT * FROM professeurs WHERE id = $1', [id]);
        if (result.rowCount === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
      }
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const role = user.role || (result.command === 'SELECT 1' ? 'eleve' : result.command === 'SELECT 2' ? 'admin' : 'prof');
    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const { password: _, ...userWithoutPassword } = user;
    console.log(userWithoutPassword);
    res.status(200).json({ message: 'Login successful', token, user: userWithoutPassword });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erreur lors de la vérification du mot de passe' });
  }
};

module.exports = { loginUser };