import Navbar from "../components/Navbar";
import NavbarMenus from "../components/NavbarMenus";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importez le hook useAuth

const NotFound = () => {
  const navigate = useNavigate();
  const { auth } = useAuth(); // Accédez au contexte d'authentification

  const handleGoHome = () => {
    if (auth) {
      navigate('/portal'); // Redirigez vers le menu si l'utilisateur est authentifié
    } else {
      navigate('/login'); // Redirigez vers la page de connexion si l'utilisateur n'est pas authentifié
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full">
        <Navbar />
        <NavbarMenus />
      </div>
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg mb-4">La page que vous recherchez n'existe pas.</p>
        <button
          onClick={handleGoHome}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default NotFound;