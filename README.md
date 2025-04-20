# MyEfrei-React - Guide de développement

Ce README détaille comment configurer et exécuter le projet MyEfrei-React, une application de gestion scolaire avec un frontend React et un backend Node.js.

## Table des matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Démarrage du projet](#démarrage-du-projet)
5. [Identifiants de connexion](#identifiants-de-connexion)
6. [Structure du projet](#structure-du-projet)
7. [Routes principales](#routes-principales)
8. [Développement](#développement)

## Prérequis

- [Node.js](https://nodejs.org/) (v14+)
- [npm](https://www.npmjs.com/) (v6+)
- [Docker](https://www.docker.com/) et [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

## Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/Mathieu9488/MyEfrei-React.git
   cd MyEfrei-React
   ```
2. Installer les dépendances du frontend :
    ```bash
    npm install
    ```

3. Installer les dépendances du backend :
    ```bash
    cd backend
    npm install
    cd ..
    ```

## Configuration

1. Créer un fichier .env à la racine du projet en copiant le fichier .env.example :
    ```bash
    cp .env.example .env
    ```

2. Le contenu du fichier .env devrait ressembler à ceci :
    ```
    REACT_APP_FRONTEND_URL=http://localhost:3000
    REACT_APP_BACKEND_URL=http://localhost:3001
    REACT_APP_DB_URL=postgresql://user:password@localhost:5432/mydatabase
    JWT_SECRET=votre_secret_jwt_ici
    ```

3. Vous pouvez laisser les valeurs par défaut pour le développement local.

## Démarrage du projet

Le projet comprend un script simplifié pour lancer l'environnement de développement complet :

```bash
npm run dev
```

Ce script :
1. Démarre la base de données PostgreSQL dans un conteneur Docker
2. Lance le serveur backend avec nodemon (rechargement automatique)
3. Démarre le serveur de développement React

Vous pouvez également lancer les composants séparément :

- Base de données uniquement : `npm run start:db`
- Backend uniquement : `npm run start:back`
- Frontend uniquement : `npm start`

## Identifiants de connexion

Le fichier init.sql initialise la base de données avec des utilisateurs par défaut :

### Administrateur
- **ID** : 1
- **Mot de passe** : admin

### Professeur
- **ID** : 10000
- **Mot de passe** : prof

## Structure du projet

```
MyEfrei-React/
├── backend/                  # Code du serveur Node.js/Express
│   ├── controllers/          # Logique métier
│   ├── db/                   # Scripts de base de données
│   ├── routes/               # Définition des routes API
│   ├── server.js             # Point d'entrée du backend
│   └── package.json          # Dépendances du backend
├── public/                   # Fichiers statiques
├── src/                      # Code source React
│   ├── components/           # Composants réutilisables
│   ├── context/              # Contextes React (Auth, etc.)
│   ├── css/                  # Styles CSS
│   ├── pages/                # Pages de l'application
│   │   ├── admin/            # Pages d'administration
│   │   └── ...
│   ├── App.js                # Composant principal
│   └── routes.js             # Configuration des routes
├── .env                      # Variables d'environnement
├── .env.example              # Exemple de variables d'environnement
├── docker-compose.yml        # Configuration Docker
└── package.json              # Dépendances et scripts du projet
```

## Routes principales

### Frontend
- `/` - Page d'accueil
- `/login` - Page de connexion
- `/portal` - Portail principal après connexion
- `/admin/*` - Pages d'administration
  - `/admin/eleves` - Gestion des élèves
  - `/admin/professeurs` - Gestion des professeurs
  - `/admin/classes` - Gestion des classes
  - `/admin/matieres` - Gestion des matières
  - `/admin/sessions` - Gestion des sessions (cours)

### Backend API
- `/login` - Authentification
- `/admin/eleves` - API de gestion des élèves
- `/admin/professeurs` - API de gestion des professeurs
- `/admin/classes` - API de gestion des classes
- `/admin/matieres` - API de gestion des matières
- `/admin/sessions` - API de gestion des sessions

## Développement

### Base de données

La base de données est initialisée avec des tables pour :
- `eleves` - Données des élèves
- `professeurs` - Données des professeurs
- `admins` - Données des administrateurs
- `classes` - Informations sur les classes
- `matieres` - Matières enseignées
- `sessions` - Cours programmés