import React from 'react';
import { useState } from "react";  
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/menu.css';

const Navbar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  
  const goToHome = () => {
    navigate('/portal');
  };

  return (
    <nav className="text-white flex justify-between items-center p-4" style={{ backgroundColor: 'rgb(22, 55, 103)' }}>
      <img 
        src="/images/logo-myefrei-pantheon.png" 
        alt="Logo myEfrei" 
        className="w-32 h-auto cursor-pointer" 
        onClick={goToHome}
        style={{ cursor: 'pointer' }}
      />
      <div className="relative">
        <button
          onClick={() => setShowPopup(!showPopup)}
          className="flex items-center space-x-2 px-4 py-2 rounded-full"
        >
          <span>{auth?.user?.firstname} {auth?.user?.name} ({auth?.role})</span>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(189, 189, 189)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="white" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </button>
        {showPopup && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg p-4">
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 hover:bg-gray-200 rounded"
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;