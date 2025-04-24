import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Edit2, Trash2, Info, Plus, ChevronDown, ChevronUp } from 'react-feather';
import Navbar from '../../components/Navbar';
import NavbarMenus from '../../components/NavbarMenus';

export default function ProfNotes() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eleves, setEleves] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedMatiereId, setSelectedMatiereId] = useState('');
  const [notification, setNotification] = useState(null);
  const [expandedEvaluations, setExpandedEvaluations] = useState({});
  const [isAddEvaluationModalOpen, setIsAddEvaluationModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState(null);
  const [evaluationForm, setEvaluationForm] = useState({
    description: '',
    date: new Date().toISOString().split('T')[0],
    coefficient: '1'
  });
  const [noteForm, setNoteForm] = useState({
    notes: {} 
  });
  
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
      
      const evaluationsMap = {};
      
      data.eleves.forEach(eleve => {
        if (eleve.notes && eleve.notes.length > 0) {
          eleve.notes.forEach(note => {
            if (!evaluationsMap[note.description]) {
              evaluationsMap[note.description] = {
                id: note.description,
                description: note.description || 'Évaluation sans titre',
                date: note.date,
                coefficient: note.coefficient || 1,
                notes: {}
              };
            }
            evaluationsMap[note.description].notes[eleve.id] = {
              id: note.id,
              note: note.note,
              eleveId: eleve.id,
              eleveName: `${eleve.name} ${eleve.firstname}`
            };
          });
        }
      });
      
      const evaluationsArray = Object.values(evaluationsMap).sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      
      setEvaluations(evaluationsArray);
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
  
  const toggleEvaluationExpand = (evaluationId) => {
    setExpandedEvaluations(prev => ({
      ...prev,
      [evaluationId]: !prev[evaluationId]
    }));
  };
  
  const openAddEvaluationModal = () => {
    setEvaluationForm({
      description: '',
      date: new Date().toISOString().split('T')[0],
      coefficient: '1'
    });
    setIsAddEvaluationModalOpen(true);
  };
  
  const openAddNoteModal = (evaluationId) => {
    setSelectedEvaluationId(evaluationId);
    
    const initialNotes = {};
    const evaluation = evaluations.find(e => e.id === evaluationId);
    
    eleves.forEach(eleve => {
      if (evaluation && evaluation.notes && evaluation.notes[eleve.id]) {
        initialNotes[eleve.id] = evaluation.notes[eleve.id].note.toString();
      } else {
        initialNotes[eleve.id] = '';
      }
    });
    
    setNoteForm({ notes: initialNotes });
    setIsAddNoteModalOpen(true);
  };
  
  const handleEvaluationFormChange = (e) => {
    const { name, value } = e.target;
    setEvaluationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNoteChange = (eleveId, value) => {
    setNoteForm(prev => ({
      notes: {
        ...prev.notes,
        [eleveId]: value
      }
    }));
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };
  
  const addEvaluation = async () => {
    if (!evaluationForm.description.trim()) {
      setNotification({
        type: 'error',
        message: 'La description de l\'évaluation est requise'
      });
      return;
    }
    
    const coeffValue = parseInt(evaluationForm.coefficient);
    if (isNaN(coeffValue) || coeffValue < 1) {
      setNotification({
        type: 'error',
        message: 'Le coefficient doit être un nombre entier positif'
      });
      return;
    }
    
    setIsAddEvaluationModalOpen(false);
    
    const newEvaluation = {
      id: Date.now().toString(),
      description: evaluationForm.description,
      date: evaluationForm.date,
      coefficient: coeffValue,
      notes: {}
    };
    
    setEvaluations(prev => [newEvaluation, ...prev]);
    
    setNotification({
      type: 'success',
      message: 'Évaluation créée avec succès'
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
    
    setSelectedEvaluationId(newEvaluation.id);
    const initialNotes = {};
    eleves.forEach(eleve => {
      initialNotes[eleve.id] = '';
    });
    setNoteForm({ notes: initialNotes });
    setIsAddNoteModalOpen(true);
  };

  const saveNotes = async () => {
    const notesToSave = [];
    const notesToUpdate = [];
    
    const evaluation = evaluations.find(e => e.id === selectedEvaluationId);
    
    for (const [eleveId, noteValue] of Object.entries(noteForm.notes)) {
      if (noteValue.trim() !== '') {
        const parsedNote = parseFloat(noteValue);
        
        if (isNaN(parsedNote) || parsedNote < 0 || parsedNote > 20) {
          setNotification({
            type: 'error',
            message: `Note invalide pour l'élève ${eleves.find(e => e.id === parseInt(eleveId))?.name} ${eleves.find(e => e.id === parseInt(eleveId))?.firstname}`
          });
          return;
        }
        
        const existingNote = evaluation.notes[eleveId];
        
        if (existingNote && existingNote.id) {
          notesToUpdate.push({
            noteId: existingNote.id,
            note: parsedNote
          });
        } else {
          notesToSave.push({
            eleveId: parseInt(eleveId),
            note: parsedNote
          });
        }
      }
    }
    
    if (notesToSave.length === 0 && notesToUpdate.length === 0) {
      setNotification({
        type: 'error',
        message: 'Aucune note à enregistrer'
      });
      return;
    }
    
    try {
      for (const noteData of notesToSave) {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/prof/notes/matiere/${selectedMatiereId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            professorId: auth.user.id,
            eleveId: noteData.eleveId,
            note: noteData.note,
            coefficient: evaluation.coefficient,
            description: evaluation.description
          }),
        });
      }
      
      for (const noteData of notesToUpdate) {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/prof/notes/${noteData.noteId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            professorId: auth.user.id,
            note: noteData.note,
            coefficient: evaluation.coefficient,
            description: evaluation.description
          }),
        });
      }
      
      fetchNotesByMatiere(selectedMatiereId);
      setIsAddNoteModalOpen(false);
      
      setNotification({
        type: 'success',
        message: 'Notes enregistrées avec succès'
      });
      
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      console.error("Erreur:", err);
      setNotification({
        type: 'error',
        message: 'Erreur lors de l\'enregistrement des notes'
      });
    }
  };
  
  const deleteEvaluation = async (evaluationId) => {
        
    const evaluation = evaluations.find(e => e.id === evaluationId);
    
    try {
      const noteIds = Object.values(evaluation.notes).map(n => n.id);
      
      for (const noteId of noteIds) {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/prof/notes/${noteId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            professorId: auth.user.id
          }),
        });
      }
      
      fetchNotesByMatiere(selectedMatiereId);
      
      setNotification({
        type: 'success',
        message: 'Évaluation supprimée avec succès'
      });
      
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      console.error("Erreur:", err);
      setNotification({
        type: 'error',
        message: 'Erreur lors de la suppression de l\'évaluation'
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
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
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
            notification.type === 'success' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className="flex items-center">
              <Info size={20} className={`mr-2 ${notification.type === 'error' ? 'text-red-500' : ''}`} />
              {notification.message}
            </div>
          </div>
        )}
      
        <div className="mb-6">
          <div className="mb-4">
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
          
          <div className="flex justify-end">
          <button
            onClick={openAddEvaluationModal}
            className="px-4 py-2 bg-blue-900 text-white rounded-md flex items-center hover:bg-blue-800"
          >
            <Plus size={16} className="mr-2" />
            Nouvelle évaluation
          </button>
          </div>
        </div>
        
        {selectedMatiereId && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">
                Évaluations - {matieres.find(m => m.id === parseInt(selectedMatiereId))?.name || "Matière"}
              </h2>
            </div>
            
            {evaluations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Aucune évaluation trouvée pour cette matière.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {evaluations.map((evaluation) => (
                  <div key={evaluation.id} className="bg-white hover:bg-gray-50">
                    <div 
                      className="px-6 py-4 flex items-center justify-between cursor-pointer"
                      onClick={() => toggleEvaluationExpand(evaluation.id)}
                    >
                      <div className="flex items-center">
                        {expandedEvaluations[evaluation.id] ? 
                          <ChevronUp className="text-gray-400 mr-2" size={20} /> : 
                          <ChevronDown className="text-gray-400 mr-2" size={20} />
                        }
                        <div>
                          <span className="font-medium">{evaluation.description}</span>
                          <div className="text-sm text-gray-500">
                            Date: {formatDate(evaluation.date)} | Coef. {evaluation.coefficient}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAddNoteModal(evaluation.id);
                        }}
                        className="text-blue-800 hover:text-blue-900 p-1"
                        title="Ajouter/Modifier les notes"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEvaluation(evaluation.id);
                        }}
                        className="text-blue-800 hover:text-blue-900 p-1"
                        title="Supprimer l'évaluation"
                      >
                        <Trash2 size={18} />
                      </button>
                      </div>
                    </div>
                    
                    {expandedEvaluations[evaluation.id] && (
                      <div className="px-10 pb-4">
                        {Object.keys(evaluation.notes).length > 0 ? (
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Élève
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Note
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {Object.values(evaluation.notes).map((noteData) => (
                                <tr key={noteData.eleveId} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {noteData.eleveName}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                      {noteData.note}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-gray-500 text-center py-4">Aucune note pour cette évaluation.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isAddEvaluationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nouvelle évaluation</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={evaluationForm.description}
                  onChange={handleEvaluationFormChange}
                  placeholder="Ex: Contrôle chapitre 1"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={evaluationForm.date}
                  onChange={handleEvaluationFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="coefficient" className="block text-sm font-medium text-gray-700 mb-1">
                  Coefficient
                </label>
                <input
                  type="number"
                  id="coefficient"
                  name="coefficient"
                  min="1"
                  value={evaluationForm.coefficient}
                  onChange={handleEvaluationFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setIsAddEvaluationModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
                >
                  Annuler
                </button>
                <button
                  onClick={addEvaluation}
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                >
                  Créer et ajouter des notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddNoteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              Notes pour: {evaluations.find(e => e.id === selectedEvaluationId)?.description}
            </h3>
            <div className="space-y-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Élève
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note (/20)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {eleves.map((eleve) => (
                    <tr key={eleve.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {eleve.name} {eleve.firstname}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.01"
                          value={noteForm.notes[eleve.id] || ''}
                          onChange={(e) => handleNoteChange(eleve.id, e.target.value)}
                          className="w-20 p-2 border border-gray-300 rounded text-center mx-auto block"
                          placeholder="--"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setIsAddNoteModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
                >
                  Annuler
                </button>
                <button
                  onClick={saveNotes}
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}