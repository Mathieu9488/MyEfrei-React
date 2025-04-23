import React, { useState, useEffect, useCallback} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Edit2, Trash2, Check, X, Info } from 'react-feather';
import Navbar from '../../components/Navbar';
import NavbarMenus from '../../components/NavbarMenus';

export default function ProfNotes() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eleves, setEleves] = useState([]);
  const [editingEleveId, setEditingEleveId] = useState(null);
  const [currentNote, setCurrentNote] = useState('');
  const [matieres, setMatieres] = useState([]);
  const [selectedMatiereId, setSelectedMatiereId] = useState('');
  const [notification, setNotification] = useState(null);
  
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { id } = useParams();

  const fetchNotesByMatiere = useCallback(async (matiereId) => {
    try {
      setLoading(true);
      
      if (!auth || !auth.user) {
        navigate('/login');
        return;
      }
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/prof/notes/matiere/${matiereId}?professorId=${auth.user.id}`);
      
      if (!response.ok) {
        throw new Error("Impossible de récupérer les notes");
      }
      
      const data = await response.json();
      
      setEleves(data.eleves);
      setLoading(false);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [auth, navigate]);
  
  const fetchProfesseurMatieres = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!auth || !auth.user) {
        navigate('/login');
        return;
      }
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/prof/professeurs/${auth.user.id}`);
      
      if (!response.ok) {
        throw new Error("Impossible de récupérer les matières du professeur");
      }
      
      const data = await response.json();
      
      if (data.matieres && Array.isArray(data.matieres)) {
        setMatieres(data.matieres);
        if (data.matieres.length > 0 && !selectedMatiereId) {
          setSelectedMatiereId(data.matieres[0].id);
          fetchNotesByMatiere(data.matieres[0].id);
        }
      } else {
        setEleves([]);
        setLoading(false);
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [auth, navigate, selectedMatiereId, fetchNotesByMatiere]);

  useEffect(() => {
    if (id) {
      setSelectedMatiereId(id);
      fetchNotesByMatiere(id);
    } else {
      fetchProfesseurMatieres();
    }
  }, [id, fetchNotesByMatiere, fetchProfesseurMatieres]);
  
  const handleMatiereChange = (e) => {
    const newMatiereId = e.target.value;
    setSelectedMatiereId(newMatiereId);
    fetchNotesByMatiere(newMatiereId);
    navigate(`/prof/notes/${newMatiereId}`);
  };
  
  const startEditing = (eleveId, currentNote) => {
    setEditingEleveId(eleveId);
    setCurrentNote(currentNote !== null ? currentNote.toString() : '');
  };
  
  const cancelEditing = () => {
    setEditingEleveId(null);
    setCurrentNote('');
  };
  
  const saveNote = async (eleveId) => {
    try {
      const noteValue = parseInt(currentNote);
      
      if (isNaN(noteValue) || noteValue < 0 || noteValue > 20) {
        setNotification({
          type: 'error',
          message: 'La note doit être un nombre entre 0 et 20'
        });
        return;
      }
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/prof/notes/matiere/${selectedMatiereId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          professorId: auth.user.id,
          eleveId: eleveId,
          note: noteValue
        }),
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement de la note");
      }
      
      fetchNotesByMatiere(selectedMatiereId);
      setEditingEleveId(null);
      setCurrentNote('');
      
      setNotification({
        type: 'success',
        message: 'Note enregistrée avec succès'
      });
      
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      console.error("Erreur:", err);
      setNotification({
        type: 'error',
        message: err.message
      });
    }
  };
  
  const deleteNote = async (noteId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/prof/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          professorId: auth.user.id
        }),
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la note");
      }
      
      fetchNotesByMatiere(selectedMatiereId);
      
      setNotification({
        type: 'success',
        message: 'Note supprimée avec succès'
      });
      
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      console.error("Erreur:", err);
      setNotification({
        type: 'error',
        message: err.message
      });
    }
  };
  
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Navbar />
        <NavbarMenus />
        <div className="p-8 flex justify-center items-center">
          <p className="text-lg">Chargement des notes...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Navbar />
        <NavbarMenus />
        <div className="p-8 flex flex-col items-center">
          <p className="text-lg text-red-600 mb-4">Erreur: {error}</p>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />
      <NavbarMenus />
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#0a2463]">Gestion des Notes</h1>
        
        {notification && (
          <div className={`mb-4 p-4 rounded-md ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className="flex items-center">
              <Info size={20} className="mr-2" />
              {notification.message}
            </div>
          </div>
        )}
        
        {/* Sélection de la matière */}
        <div className="mb-6">
          <label htmlFor="matiere" className="block text-sm font-medium text-gray-700 mb-1">
            Sélectionner une matière
          </label>
          <select
            id="matiere"
            value={selectedMatiereId}
            onChange={handleMatiereChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {matieres.length === 0 ? (
              <option value="">Aucune matière disponible</option>
            ) : (
              matieres.map(matiere => (
                <option key={matiere.id} value={matiere.id}>
                  {matiere.name} - {matiere.classe_name || "Sans classe"}
                </option>
              ))
            )}
          </select>
        </div>
        
        {/* Liste des élèves avec leurs notes */}
        {selectedMatiereId && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">
                {matieres.find(m => m.id === parseInt(selectedMatiereId))?.name || "Matière"} - 
                {matieres.find(m => m.id === parseInt(selectedMatiereId))?.classe_name || ""}
              </h2>
            </div>
            
            {eleves.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Aucun élève trouvé pour cette matière.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prénom
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note (/20)
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {eleves.map((eleve) => (
                    <tr key={eleve.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {eleve.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {eleve.firstname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {editingEleveId === eleve.id ? (
                          <input
                            type="number"
                            min="0"
                            max="20"
                            className="w-16 px-2 py-1 border rounded text-center"
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                            autoFocus
                          />
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            eleve.note !== null
                              ? eleve.note >= 10
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {eleve.note !== null ? eleve.note : 'Non noté'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        {editingEleveId === eleve.id ? (
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => saveNote(eleve.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-red-600 hover:text-red-900"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => startEditing(eleve.id, eleve.note)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit2 size={18} />
                            </button>
                            {eleve.note !== null && (
                              <button
                                onClick={() => deleteNote(eleve.note_id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}