import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Info, AlertCircle } from 'react-feather';
import Navbar from '../../components/Navbar';
import NavbarMenus from '../../components/NavbarMenus';

export default function EleveNotes() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matieres, setMatieres] = useState([]);
  const [moyenneGenerale, setMoyenneGenerale] = useState(null);
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotesAndCourses = async () => {
      try {
        setLoading(true);
        
        if (!auth || !auth.user) {
          navigate('/login');
          return;
        }
        
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/eleve/eleves/${auth.user.id}/all-matieres`);
        
        if (!response.ok) {
          throw new Error("Impossible de récupérer les matières et notes");
        }
        
        const data = await response.json();
        
        if (data && data.matieres) {
          setMatieres(data.matieres);
          
          let sommeNotesCoef = 0;
          let sommeCoef = 0;
          let hasNotes = false;
          
          data.matieres.forEach(matiere => {
            if (matiere.notes && matiere.notes.length > 0) {
              matiere.notes.forEach(note => {
                const coef = note.coefficient || 1;
                sommeNotesCoef += note.note * coef;
                sommeCoef += coef;
                hasNotes = true;
              });
            }
          });
          
          if (hasNotes) {
            setMoyenneGenerale((sommeNotesCoef / sommeCoef).toFixed(2));
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchNotesAndCourses();
  }, [auth, navigate]);

  const calculateMatiereAverage = (notes) => {
    if (!notes || notes.length === 0) return null;
    
    let sommeNotesCoef = 0;
    let sommeCoef = 0;
    
    notes.forEach(note => {
      const coef = note.coefficient || 1;
      sommeNotesCoef += note.note * coef;
      sommeCoef += coef;
    });
    
    return sommeCoef > 0 ? (sommeNotesCoef / sommeCoef).toFixed(2) : null;
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Navbar />
        <NavbarMenus />
        <div className="p-8 flex justify-center items-center">
          <p className="text-xl">Chargement des notes...</p>
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
          <p className="text-xl text-red-600 mb-4">Erreur: {error}</p>
          <button 
            className="bg-blue-700 text-white px-6 py-3 rounded text-lg"
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
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0a2463]">Notes</h1>
            <div className="text-base text-gray-600 flex items-center mt-2">
              <Info size={16} className="mr-2" />
              Toutes les moyennes sont des estimations réalisées sur la base des notes saisies par les professeurs.
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex items-center">
              <div className="text-lg font-medium text-gray-700 mr-3">Moyenne générale</div>
              <div className="text-2xl font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded">
                {moyenneGenerale ? `${moyenneGenerale}/20` : '-'}
              </div>
            </div>
          </div>
        </div>
        
        {matieres.length === 0 ? (
          <div className="bg-white shadow-lg rounded-lg p-10 text-center">
            <AlertCircle className="mx-auto mb-4 text-gray-500" size={48} />
            <p className="text-gray-700 text-xl">Aucune note disponible pour le moment.</p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-8 py-4 text-left text-base font-medium text-gray-700 uppercase tracking-wider">
                    Module
                  </th>
                  <th scope="col" className="px-8 py-4 text-center text-base font-medium text-gray-700 uppercase tracking-wider">
                    Coef
                  </th>
                  <th scope="col" className="px-8 py-4 text-center text-base font-medium text-gray-700 uppercase tracking-wider">
                    Moyenne/Résultat
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matieres.map((matiere) => {
                  const moyenne = calculateMatiereAverage(matiere.notes);
                  return (
                    <React.Fragment key={matiere.matiere.id}>
                      <tr className="bg-gray-50">
                        <td className="px-8 py-4 text-base font-medium text-gray-800">
                          {matiere.matiere.name}
                          {matiere.professeur && (
                            <div className="text-sm text-gray-600 mt-1">
                              {matiere.professeur.firstname} {matiere.professeur.name}
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-4 text-center text-base text-gray-600"></td>
                        <td className="px-8 py-4 text-center text-lg font-bold text-gray-800 bg-gray-100">
                          {moyenne ? moyenne : '-'}
                        </td>
                      </tr>
                      
                      {matiere.notes && matiere.notes.map(note => (
                        <tr key={note.id} className="hover:bg-gray-50">
                          <td className="px-8 py-4 text-base text-gray-700 pl-12">
                            {note.description || 'Évaluation'}
                          </td>
                          <td className="px-8 py-4 text-center text-base text-gray-700 font-medium">
                            {note.coefficient || 1}
                          </td>
                          <td className="px-8 py-4 text-center text-base font-medium text-gray-800">
                            {note.note}
                          </td>
                        </tr>
                      ))}
                      
                      {(!matiere.notes || matiere.notes.length === 0) && (
                        <tr>
                          <td colSpan="3" className="px-8 py-3 text-center text-base text-gray-600 italic">
                            Aucune note disponible pour cette matière
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}