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
  FOREIGN KEY (eleve_id) REFERENCES eleves(id),
  FOREIGN KEY (matieres_id) REFERENCES matieres(id)
);

-- Ajout des professeurs
INSERT INTO professeurs (id, name, firstname, password) VALUES 
(10000, 'Melvin', 'Bissor', '$2b$10$QsVCNiUEg48v96Zyo1UYxuaxMpfWixnAoffBkDed.g8rxLI3NCjrS'), -- password: prof
(10001, 'MARTIN', 'Kelig', '$2b$10$QsVCNiUEg48v96Zyo1UYxuaxMpfWixnAoffBkDed.g8rxLI3NCjrS'),
(10002, 'MAVRODIS', 'Michael', '$2b$10$QsVCNiUEg48v96Zyo1UYxuaxMpfWixnAoffBkDed.g8rxLI3NCjrS'),
(10003, 'SIBER', 'Eric', '$2b$10$QsVCNiUEg48v96Zyo1UYxuaxMpfWixnAoffBkDed.g8rxLI3NCjrS'),
(10004, 'HABBOUB KAJIOU', 'Imane', '$2b$10$QsVCNiUEg48v96Zyo1UYxuaxMpfWixnAoffBkDed.g8rxLI3NCjrS'),
(10005, 'SHARMA', 'Nupur', '$2b$10$QsVCNiUEg48v96Zyo1UYxuaxMpfWixnAoffBkDed.g8rxLI3NCjrS'),
(10006, 'BEN AMOR', 'Imed', '$2b$10$QsVCNiUEg48v96Zyo1UYxuaxMpfWixnAoffBkDed.g8rxLI3NCjrS'),
(10007, 'LORD', 'Barthélémy', '$2b$10$QsVCNiUEg48v96Zyo1UYxuaxMpfWixnAoffBkDed.g8rxLI3NCjrS'); 

-- Ajout d'un admin
INSERT INTO admins (id, name, firstname, password) VALUES (1, 'Léa', 'Delacroix', '$2b$10$XwJhrtXWn0Z3BvPB12/R6O457cugSKwId84mnv8hSccQ/CRaZ4ZvS'); -- password: admin

-- Ajout des classes
INSERT INTO classes (id, name) VALUES (1, 'X-IN-BAC-1'), (2, 'X-IN-BAC-2'), (3, 'X-IN-BAC-3'), (4, 'X-CS-BAC-1'), (5, 'X-CS-BAC-2'), (6, 'X-CS-BAC-3');

-- Ajout des élèves
INSERT INTO eleves (id, name, firstname, classe_id, password) VALUES 
(20210001, 'BESNARD', 'Clément', 1, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'), -- password: eleve
(20210002, 'DIAW', 'Abdoul', 1, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210003, 'POISSONNEAU', 'Alexandre', 1, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210004, 'QUENTREC', 'Alice', 2, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210005, 'MESSAGE', 'David', 2, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210006, 'ABALTOU', 'Djibril', 2, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210007, 'ROUSSEAU', 'Etienne', 3, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210008, 'LARIBI', 'Koussaï', 3, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210009, 'COTELLON', 'Loane', 3, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210010, 'RANDRIAMAHEFA', 'Maharo', 4, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210011, 'CRESPIN', 'Mathieu', 4, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210012, 'AMOKRANE', 'Sami', 4, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210013, 'POINAMA', 'Samuel', 5, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210014, 'AKOURI', 'Sarah', 5, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210015, 'OUAMARA', 'Sarah', 5, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210016, 'OSIAS', 'Sergio-Léon', 1, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210017, 'MELOTTI', 'Simone', 2, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210018, 'RIPOLL', 'Thomas', 3, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210019, 'TRUGUET', 'William', 4, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210020, 'CHANDRAKUMAR', 'Adrien', 5, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe'),
(20210021, 'DRAGAN', 'Constantin', 1, '$2b$10$02adDM4hkinU35DWliAmju0i.76TPzBb4ndxCJOQzLeLRX.hfWURe');

-- Ajout des matières
INSERT INTO matieres (id, name, professeur_id, classe_id) VALUES 
(1, 'React.js', 10000, 1),
(2, 'Jakarta Entreprise Edition (Rappel Java + JEE)', 10001, 1),
(3, 'Docker avancé', 10002, 1),
(4, 'Secure coding - OWASP', 10003, 1),
(5, 'Suivi de rédaction du mémoire professionnel', 10004, 1),
(6, 'Anglais', 10005, 1),
(7, 'Programmation fonctionnelle', 10006, 1),
(8, 'Visualisation des données de recherche (Stack ELK)', 10007, 1);

-- Ajout des sessions
INSERT INTO sessions (id, matieres_id, date, start_time, end_time, salle) VALUES 
(1, 1, '2025-04-23', '08:00:00', '10:00:00', 'H101'),
(2, 2, '2025-04-23', '10:00:00', '12:00:00', 'H102'),
(3, 3, '2025-04-23', '14:00:00', '16:00:00', 'H103'),
(4, 4, '2025-04-23', '08:00:00', '10:00:00', 'H104'),
(5, 5, '2025-04-23', '10:00:00', '12:00:00', 'H105'),
(6, 6, '2025-04-23', '14:00:00', '16:00:00', 'H106'),
(7, 7, '2025-04-23', '08:00:00', '10:00:00', 'H107'),
(8, 8, '2025-04-23', '10:00:00', '12:00:00', 'H108');