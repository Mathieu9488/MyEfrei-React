import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Menu from './pages/portal';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import AdminElevesPage from './pages/admin/eleves';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/portal" element={<ProtectedRoute roles={['eleve', 'admin', 'prof']}><Menu /></ProtectedRoute>} />
        <Route path="/admin/eleves" element={<ProtectedRoute roles={['admin']}><AdminElevesPage /></ProtectedRoute>} />
        <Route path="*" element={<ProtectedRoute roles={['eleve', 'admin', 'prof']}><NotFound /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;