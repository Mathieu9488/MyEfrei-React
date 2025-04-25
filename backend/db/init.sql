CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS eleves (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  classe_id INTEGER,
  password VARCHAR(255) NOT NULL,
  FOREIGN KEY (classe_id) REFERENCES classes(id)
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS professeurs (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS matieres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  professeur_id INTEGER,
  classe_id INTEGER,
  FOREIGN KEY (professeur_id) REFERENCES professeurs(id),
  FOREIGN KEY (classe_id) REFERENCES classes(id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  matieres_id INTEGER NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  salle VARCHAR(50),
  FOREIGN KEY (matieres_id) REFERENCES matieres(id)
);

CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  eleve_id INTEGER,
  matieres_id INTEGER,
  note INTEGER NOT NULL,
  coefficient INTEGER DEFAULT 1,
  description VARCHAR(255),
  date DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (eleve_id) REFERENCES eleves(id),
  FOREIGN KEY (matieres_id) REFERENCES matieres(id)
);


INSERT INTO admins (id, name, firstname, password) VALUES (1, 'Léa', 'Delacroix', '$2b$10$XwJhrtXWn0Z3BvPB12/R6O457cugSKwId84mnv8hSccQ/CRaZ4ZvS'); -- password: admin