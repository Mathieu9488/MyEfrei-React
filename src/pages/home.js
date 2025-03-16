import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Left Side */}
      <div
        className="w-3/5 text-white flex flex-col items-center justify-center p-10"
        style={{ backgroundImage: "url('/images/myefrei-background.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="text-5xl font-bold flex flex-col items-center gap-4">
          <img src="/images/logo-myefrei-pantheon.png" alt="Logo myEfrei" className="w-64 h-64 object-contain" />
        </div>
      </div>

      {/* Right Side */}
      <div className="w-2/5 bg-white flex flex-col justify-center items-center p-10 text-center shadow-lg">
        <div className="flex-grow flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-blue-900">BIENVENUE</h1>
          <h2 className="text-xl font-semibold text-orange-500 mt-2 uppercase">Sur la plateforme web de l'Efrei</h2>
          <p className="mt-4 text-gray-600 text-lg">Retrouvez l'ensemble de vos <span className="font-semibold">services sur myEfrei</span>.</p>
          <button
            onClick={handleLoginClick}
            className="mt-6 bg-blue-900 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-800 transition-all shadow-md"
          >
            SE CONNECTER
          </button>
        </div>
        <footer className="mt-10 text-gray-400 text-sm text-center">
          <p>© 2025 Efrei | Établissement d’enseignement supérieur technique privé</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;