// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import Loading from '../components/Loading'; // Importez le composant Loading

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true); // Nouvel état

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    console.log("Stored Auth:", storedAuth);

    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      const decodedToken = jwtDecode(parsedAuth.token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('auth');
        setAuth(null);
      } else {
        setAuth(parsedAuth);
      }
    }

    setLoading(false); // Fin du chargement
  }, []);

  if (loading) return <Loading /> // Ne pas afficher ProtectedRoute tant que c'est en cours


  const login = (token, user) => {
    const decoded = jwtDecode(token);
    setAuth({ token, user, role: decoded.role });
    localStorage.setItem('auth', JSON.stringify({ token, user, role: decoded.role }));
    console.log("Logged in:", { token, user, role: decoded.role });
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
    console.log("Logged out");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);