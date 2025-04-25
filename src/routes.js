import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Menu from './pages/portal';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import AdminElevesPage from './pages/admin/eleves';
import AdminClassesPage from './pages/admin/classes';
import AdminProfesseursPage from './pages/admin/professeurs';
import AdminMatieresPage from './pages/admin/matieres';
import AdminSessionsPage from './pages/admin/sessions';
import PlanningPage from './pages/planning';
import ProfNotes from './pages/prof/notes';
import EleveNotes from './pages/eleve/notes';
import SchoolPage from "./pages/eleve/school";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/portal" element={<ProtectedRoute roles={['eleve', 'admin', 'prof']}><Menu /></ProtectedRoute>} />
        <Route path="/admin/eleves" element={<ProtectedRoute roles={['admin']}><AdminElevesPage /></ProtectedRoute>} />
        <Route path="/admin/classes" element={<ProtectedRoute roles={['admin']}><AdminClassesPage /></ProtectedRoute>} />
        <Route path="/admin/professeurs" element={<ProtectedRoute roles={['admin']}><AdminProfesseursPage /></ProtectedRoute>} />
        <Route path="/admin/matieres" element={<ProtectedRoute roles={['admin']}><AdminMatieresPage /></ProtectedRoute>} />
        <Route path="/admin/sessions" element={<ProtectedRoute roles={['admin']}><AdminSessionsPage /></ProtectedRoute>} />
        <Route path="/planning" element={<ProtectedRoute roles={['eleve', 'prof']}><PlanningPage /></ProtectedRoute>} />
        <Route path="/prof/notes" element={<ProtectedRoute roles={['prof']}><ProfNotes /></ProtectedRoute>} />
        <Route path="/prof/notes/:id" element={<ProtectedRoute roles={['prof']}><ProfNotes /></ProtectedRoute>} />  
        <Route path="/eleve/notes" element={<ProtectedRoute roles={['eleve']}><EleveNotes /></ProtectedRoute>} />
        <Route path="/eleve/school" element={<ProtectedRoute roles={['eleve']}><SchoolPage /></ProtectedRoute>} />
        <Route path="*" element={<ProtectedRoute roles={['eleve', 'admin', 'prof']}><NotFound /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;