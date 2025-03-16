const bcrypt = require('bcryptjs');
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

    const { password: _, ...userWithoutPassword } = user;
    console.log(userWithoutPassword || "no user found");
    res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la vérification du mot de passe' });
  }
};

module.exports = { loginUser };