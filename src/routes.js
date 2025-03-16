import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Menu from './pages/menu';
import Planning from './pages/planning';
import Notes from './pages/notes';
import AdminPannel from './pages/admin-pannel';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<ProtectedRoute roles={['eleve', 'admin', 'prof']}><Menu /></ProtectedRoute>} />
        <Route path="/planning" element={<ProtectedRoute roles={['eleve', 'admin', 'prof']}><Planning /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute roles={['eleve', 'admin', 'prof']}><Notes /></ProtectedRoute>} />
        <Route path="/admin-pannel" element={<ProtectedRoute roles={['eleve', 'admin']}><AdminPannel /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;