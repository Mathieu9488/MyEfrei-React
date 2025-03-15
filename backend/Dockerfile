# backend/Dockerfile
# Utiliser une image de base pour Node.js
FROM node:14

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port sur lequel l'application va tourner
EXPOSE 3001

# Commande pour démarrer l'application
CMD ["node", "server.js"]