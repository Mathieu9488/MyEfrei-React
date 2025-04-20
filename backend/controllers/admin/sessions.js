const pool = require('../../db');

const getSessions = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT s.*, m.name as matiere_name, p.name as professeur_name, p.firstname as professeur_firstname, c.name as classe_name, c.id as classe_id ' +
      'FROM sessions s ' +
      'JOIN matieres m ON s.matieres_id = m.id ' +
      'LEFT JOIN professeurs p ON m.professeur_id = p.id ' +
      'LEFT JOIN classes c ON m.classe_id = c.id ' +
      'ORDER BY s.date, s.start_time'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des sessions' });
  }
};

const getSessionById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT s.*, m.name as matiere_name, p.name as professeur_name, p.firstname as professeur_firstname, c.name as classe_name, c.id as classe_id ' +
      'FROM sessions s ' +
      'JOIN matieres m ON s.matieres_id = m.id ' +
      'LEFT JOIN professeurs p ON m.professeur_id = p.id ' +
      'LEFT JOIN classes c ON m.classe_id = c.id ' +
      'WHERE s.id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la session' });
  }
};

const checkSessionConflicts = async (date, start_time, end_time, salle, matieres_id, sessionId = null) => {
  const conflicts = {
    salle: false,
    professeur: false,
    classe: false,
    messages: []
  };

  if (start_time >= end_time) {
    conflicts.messages.push('L\'heure de début doit être antérieure à l\'heure de fin');
    return conflicts;
  }

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const matiereInfo = await client.query(
      'SELECT m.id, m.professeur_id, m.classe_id FROM matieres m WHERE m.id = $1',
      [matieres_id]
    );
    
    if (matiereInfo.rowCount === 0) {
      conflicts.messages.push('Matière non trouvée');
      return conflicts;
    }
    
    const professeur_id = matiereInfo.rows[0].professeur_id;
    const classe_id = matiereInfo.rows[0].classe_id;
    
    if (salle) {
      const salleQuery = `
        SELECT s.id FROM sessions s 
        WHERE s.date = $1 AND s.salle = $2 
        AND (
          (s.start_time <= $3 AND s.end_time > $3) OR 
          (s.start_time < $4 AND s.end_time >= $4) OR 
          (s.start_time >= $3 AND s.end_time <= $4)
        )
        ${sessionId ? ' AND s.id != $5' : ''}
      `;
      
      const salleQueryParams = sessionId 
        ? [date, salle, start_time, end_time, sessionId] 
        : [date, salle, start_time, end_time];
      
      const salleResult = await client.query(salleQuery, salleQueryParams);
      
      if (salleResult.rowCount > 0) {
        conflicts.salle = true;
        conflicts.messages.push('La salle est déjà réservée à cette date et à cette heure');
      }
    }
    
    if (professeur_id) {
      const profQuery = `
        SELECT s.id FROM sessions s 
        JOIN matieres m ON s.matieres_id = m.id 
        WHERE m.professeur_id = $1 AND s.date = $2 
        AND (
          (s.start_time <= $3 AND s.end_time > $3) OR 
          (s.start_time < $4 AND s.end_time >= $4) OR 
          (s.start_time >= $3 AND s.end_time <= $4)
        )
        ${sessionId ? ' AND s.id != $5' : ''}
      `;
      
      const profQueryParams = sessionId 
        ? [professeur_id, date, start_time, end_time, sessionId] 
        : [professeur_id, date, start_time, end_time];
      
      const profResult = await client.query(profQuery, profQueryParams);
      
      if (profResult.rowCount > 0) {
        conflicts.professeur = true;
        conflicts.messages.push('Le professeur est déjà occupé à cette date et à cette heure');
      }
    }
    
    if (classe_id) {
      const classeQuery = `
        SELECT s.id FROM sessions s 
        JOIN matieres m ON s.matieres_id = m.id 
        WHERE m.classe_id = $1 AND s.date = $2 
        AND (
          (s.start_time <= $3 AND s.end_time > $3) OR 
          (s.start_time < $4 AND s.end_time >= $4) OR 
          (s.start_time >= $3 AND s.end_time <= $4)
        )
        ${sessionId ? ' AND s.id != $5' : ''}
      `;
      
      const classeQueryParams = sessionId 
        ? [classe_id, date, start_time, end_time, sessionId] 
        : [classe_id, date, start_time, end_time];
      
      const classeResult = await client.query(classeQuery, classeQueryParams);
      
      if (classeResult.rowCount > 0) {
        conflicts.classe = true;
        conflicts.messages.push('La classe est déjà occupée à cette date et à cette heure');
      }
    }
    
    await client.query('COMMIT');
    return conflicts;
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de la vérification des conflits:', error);
    conflicts.messages.push('Erreur interne lors de la vérification des conflits');
    return conflicts;
  } finally {
    client.release();
  }
};

const addSession = async (req, res) => {
  const { matieres_id, date, start_time, end_time, salle } = req.body;
  
  if (!matieres_id || !date || !start_time || !end_time) {
    return res.status(400).json({ 
      error: 'Les champs matière, date, heure de début et heure de fin sont requis' 
    });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const conflicts = await checkSessionConflicts(date, start_time, end_time, salle, matieres_id);
    
    if (conflicts.messages.length > 0) {
      return res.status(409).json({ error: conflicts.messages[0] });
    }
    
    const newSessionResult = await client.query(
      'INSERT INTO sessions (matieres_id, date, start_time, end_time, salle) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [matieres_id, date, start_time, end_time, salle]
    );

    const sessionId = newSessionResult.rows[0].id;
    const sessionDetailsResult = await client.query(
      'SELECT s.*, m.name as matiere_name, p.name as professeur_name, p.firstname as professeur_firstname, c.name as classe_name, c.id as classe_id ' +
      'FROM sessions s ' +
      'JOIN matieres m ON s.matieres_id = m.id ' +
      'LEFT JOIN professeurs p ON m.professeur_id = p.id ' +
      'LEFT JOIN classes c ON m.classe_id = c.id ' +
      'WHERE s.id = $1',
      [sessionId]
    );
    
    await client.query('COMMIT');
    res.status(201).json(sessionDetailsResult.rows[0]);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la session' });
  } finally {
    client.release();
  }
};

const updateSession = async (req, res) => {
  const { id } = req.params;
  const { matieres_id, date, start_time, end_time, salle } = req.body;
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const sessionResult = await client.query('SELECT * FROM sessions WHERE id = $1', [id]);
    if (sessionResult.rowCount === 0) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }
    
    const session = sessionResult.rows[0];
    
    const newMatiereId = matieres_id !== undefined && matieres_id !== '' ? matieres_id : session.matieres_id;
    const newDate = date !== undefined && date !== '' ? date : session.date;
    const newStartTime = start_time !== undefined && start_time !== '' ? start_time : session.start_time;
    const newEndTime = end_time !== undefined && end_time !== '' ? end_time : session.end_time;
    const newSalle = salle !== undefined ? salle : session.salle;
    
    if (newMatiereId !== session.matieres_id) {
      const matiereResult = await client.query('SELECT * FROM matieres WHERE id = $1', [newMatiereId]);
      if (matiereResult.rowCount === 0) {
        return res.status(404).json({ error: 'Matière non trouvée' });
      }
    }
    
    const conflicts = await checkSessionConflicts(newDate, newStartTime, newEndTime, newSalle, newMatiereId, id);
    
    if (conflicts.messages.length > 0) {
      return res.status(409).json({ error: conflicts.messages[0] });
    }
    
    await client.query(
      'UPDATE sessions SET matieres_id = $1, date = $2, start_time = $3, end_time = $4, salle = $5 WHERE id = $6',
      [newMatiereId, newDate, newStartTime, newEndTime, newSalle, id]
    );
    
    const updatedSessionResult = await client.query(
      'SELECT s.*, m.name as matiere_name, p.name as professeur_name, p.firstname as professeur_firstname, c.name as classe_name, c.id as classe_id ' +
      'FROM sessions s ' +
      'JOIN matieres m ON s.matieres_id = m.id ' +
      'LEFT JOIN professeurs p ON m.professeur_id = p.id ' +
      'LEFT JOIN classes c ON m.classe_id = c.id ' +
      'WHERE s.id = $1',
      [id]
    );
    
    await client.query('COMMIT');
    res.json(updatedSessionResult.rows[0]);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la session' });
  } finally {
    client.release();
  }
};

const deleteSession = async (req, res) => {
  const { id } = req.params;
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const result = await client.query('DELETE FROM sessions WHERE id = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Session non trouvée' });
    }
    
    await client.query('COMMIT');
    res.json({ message: 'Session supprimée avec succès', session: result.rows[0] });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la session' });
  } finally {
    client.release();
  }
};

module.exports = {
  getSessions,
  getSessionById,
  addSession,
  updateSession,
  deleteSession
};