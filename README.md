# MyEfrei-React

## Description

MyEfrei est une plateforme éducative complète développée pour l'Efrei, offrant des fonctionnalités adaptées aux étudiants, professeurs et administrateurs. Cette application web permet la gestion des cours, des notes, des emplois du temps, et plus encore.

## Technologies utilisées

- **Frontend** : React.js, Tailwind CSS
- **Backend** : Node.js, Express
- **Base de données** : PostgreSQL
- **Autres librairies** :
  - date-fns pour la manipulation des dates
  - lucide-react pour les icônes
  - react-router-dom pour la navigation

## Installation

### Prérequis

- Docker et Docker Compose

### Étapes d'installation

1. Clonez le dépôt

   ```bash
   git clone https://github.com/votre-username/MyEfrei-React.git
   cd MyEfrei-React
   ```
2. Utilisez Docker Compose pour construire et démarrer l'application

   ```bash
   docker compose up --build
   ```

   Cette commande va:

   - Construire les images Docker pour le frontend et le backend
   - Configurer la base de données PostgreSQL
   - Démarrer tous les services nécessaires
3. Accédez à l'application dans votre navigateur à l'adresse `http://localhost:3000`

## Fonctionnalités

### Pour les étudiants

- Consultation de l'emploi du temps
- Visualisation des notes et calcul des moyennes
- Informations sur les campus et sites de l'école
- Actualités et événements de l'école

### Pour les professeurs

- Gestion des notes et évaluations
- Consultation des cours à dispenser
- Communication avec les étudiants

### Pour les administrateurs

- Gestion des comptes étudiants et professeurs
- Gestion des classes
- Gestion des matières et leur attribution
- Planification des sessions de cours

## Structure du projet

```
MyEfrei-React/
├── public/               # Fichiers statiques
├── src/                  # Code source React
│   ├── components/       # Composants réutilisables
│   ├── context/          # Contextes React (AuthContext, etc.)
│   ├── pages/            # Pages de l'application
│   │   ├── admin/        # Pages pour les administrateurs
│   │   ├── eleve/        # Pages pour les étudiants
│   │   ├── prof/         # Pages pour les professeurs
│   │   └── ...
│   └── ...
└── backend/              # Code serveur
    ├── controllers/      # Contrôleurs par rôle
    ├── db/               # Configuration de la base de données
    ├── routes/           # Routes API
    └── ...
```

## Pages principales

1. **Portal** - Accueil et actualités de l'école
2. **Planning** - Emploi du temps des cours
3. **Notes** - Consultation et gestion des notes
4. **Campus** - Informations sur les différents sites de l'école
5. **Administration** - Gestion des utilisateurs, classes, matières, etc.

## Identifiants de connexion

### Administrateur

- Identifiant : admin
- Mot de passe : admin

### Professeur

- Identifiant : 10000
- Mot de passe : prof

### Élève

- Identifiant : 20221112
- Mot de passe : eleve

## Auteurs

*BESNARD Clément & CRESPIN Mathieu*
