CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS eleves (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  classe_id INTEGER,
  password VARCHAR(255) NOT NULL,
  FOREIGN KEY (classe_id) REFERENCES classes(id)
);

CREATE TABLE IF NOT EXISTS professeurs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS cours (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  professeur_id INTEGER,
  classe_id INTEGER,
  FOREIGN KEY (professeur_id) REFERENCES professeurs(id),
  FOREIGN KEY (classe_id) REFERENCES classes(id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  cours_id INTEGER,
  heure TIMESTAMP,
  FOREIGN KEY (cours_id) REFERENCES cours(id)
);

CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  eleve_id INTEGER,
  cours_id INTEGER,
  note INTEGER NOT NULL,
  FOREIGN KEY (eleve_id) REFERENCES eleves(id),
  FOREIGN KEY (cours_id) REFERENCES cours(id)
);