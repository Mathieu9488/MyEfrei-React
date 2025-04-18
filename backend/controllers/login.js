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
    let result;
    let role;

    // Vérifier dans la table des élèves
    result = await pool.query('SELECT * FROM eleves WHERE id = $1', [id]);
    if (result.rowCount > 0) {
      role = 'eleve';
    } else {
      // Si non trouvé, vérifier dans la table des admins
      result = await pool.query('SELECT * FROM admins WHERE id = $1', [id]);
      if (result.rowCount > 0) {
        role = 'admin';
      } else {
        // Si non trouvé, vérifier dans la table des professeurs
        result = await pool.query('SELECT * FROM professeurs WHERE id = $1', [id]);
        console.log("profs :", result)
        if (result.rowCount > 0) {
          role = 'prof';
        } else {
          return res.status(404).json({ error: 'User not found' });
        }
      }
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const { password: _, ...userWithoutPassword } = user;
    console.log(userWithoutPassword, role); 
    res.status(200).json({ message: 'Login successful', token, user: userWithoutPassword });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erreur lors de la vérification du mot de passe' });
  }
};

module.exports = { loginUser };