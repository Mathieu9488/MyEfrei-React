const { Pool } = require('pg');

const connectionString = process.env.REACT_APP_DB_URL;

const pool = new Pool({
  connectionString,
});

module.exports = pool;