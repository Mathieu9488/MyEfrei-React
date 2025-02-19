import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Planning from './pages/planning';
import Notes from './pages/notes';
import AdminPannel from './pages/admin-pannel';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/admin-pannel" element={<AdminPannel />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;