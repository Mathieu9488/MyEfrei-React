import { useState, useEffect } from "react";
import { Plus, Trash, Pencil, Filter, Search, X, ArrowDown, ArrowUp, Calendar, Clock } from "lucide-react";
import Navbar from "../../components/Navbar";
import NavbarMenus from "../../components/NavbarMenus";

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [search, setSearch] = useState("");
  const [activeSearchColumn, setActiveSearchColumn] = useState("all");
  const [newSession, setNewSession] = useState({ 
    matieres_id: "", 
    date: "", 
    start_time: "",
    end_time: "", 
    salle: "" 
  });
  const [editingSession, setEditingSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [filterValues, setFilterValues] = useState({
    id: "",
    matiere: "",
    professeur: "",
    classe: "",
    date: "",
    horaire: "",
    salle: ""
  });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });
  const itemsPerPage = 30;
  const [searchMatiere, setSearchMatiere] = useState("");
  const [selectedMatiereName, setSelectedMatiereName] = useState("");
  const [showMatieresList, setShowMatieresList] = useState(false);
  const [filterClasse, setFilterClasse] = useState("");
  const [filterProf, setFilterProf] = useState("");

  useEffect(() => {
    fetchSessions();
    fetchMatieres();
  }, []);

  useEffect(() => {
    if (isEditing && editingSession?.matieres_id) {
      const selectedMatiere = matieres.find(m => m.id === parseInt(editingSession.matieres_id));
      if (selectedMatiere) {
        setSelectedMatiereName(`${selectedMatiere.name} - ${selectedMatiere.classe_name || "Sans classe"} (${selectedMatiere.professeur_name ? `${selectedMatiere.professeur_name} ${selectedMatiere.professeur_firstname}` : "Sans professeur"})`);
      }
    }
  }, [isEditing, editingSession, matieres]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (showMatieresList && !event.target.closest('.matieres-selector')) {
        setShowMatieresList(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMatieresList]);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/sessions`);
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des sessions:", error);
    }
  };

  const fetchMatieres = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/matieres`);
      const data = await response.json();
      setMatieres(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des matières:", error);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'ascending' 
        ? <ArrowUp size={14} className="text-blue-600" />
        : <ArrowDown size={14} className="text-blue-600" />;
    }
    return null;
  };

  const filterMatieresResults = () => {
    return matieres.filter(matiere => {
      const matchSearch = matiere.name.toLowerCase().includes(searchMatiere.toLowerCase());
      const matchClasse = !filterClasse || (matiere.classe_name === filterClasse);
      const matchProf = !filterProf || (matiere.professeur_name && `${matiere.professeur_name} ${matiere.professeur_firstname}` === filterProf);
      return matchSearch && matchClasse && matchProf;
    });
  };

  const addSession = async () => {
    if (!newSession.matieres_id || !newSession.date || !newSession.start_time || !newSession.end_time) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSession),
      });
      
      if (response.status === 409) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }
      
      if (response.ok) {
        fetchSessions();
        setNewSession({ matieres_id: "", date: "", start_time: "", end_time: "", salle: "" });
        setIsModalOpen(false);
        setError("");
        setSelectedMatiereName("");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la session:", error);
      setError("Une erreur est survenue lors de l'ajout de la session");
    }
  };

  const deleteSession = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/sessions/${id}`, {
        method: "DELETE",
      });
      fetchSessions();
    } catch (error) {
      console.error("Erreur lors de la suppression de la session:", error);
    }
  };

  const updateSession = async () => {
    if (!editingSession.matieres_id || !editingSession.date || !editingSession.start_time || !editingSession.end_time) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/sessions/${editingSession.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSession),
      });
      
      if (response.status === 409) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }
      
      if (response.ok) {
        fetchSessions();
        setEditingSession(null);
        setIsModalOpen(false);
        setError("");
        setSelectedMatiereName("");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la session:", error);
      setError("Une erreur est survenue lors de la mise à jour de la session");
    }
  };

  const openCreateModal = () => {
    setNewSession({ matieres_id: "", date: "", start_time: "", end_time: "", salle: "" });
    setIsEditing(false);
    setIsModalOpen(true);
    setError("");
    setSelectedMatiereName("");
  };

  const openEditModal = (session) => {
    const dateObj = new Date(session.date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    setEditingSession({
      id: session.id,
      matieres_id: session.matieres_id,
      date: formattedDate,
      start_time: session.start_time.substring(0, 5),
      end_time: session.end_time.substring(0, 5),
      salle: session.salle || ""
    });
    setIsEditing(true);
    setIsModalOpen(true);
    setError("");
  };

  const toggleFilterColumn = (column) => {
    if (activeSearchColumn === column) {
      setActiveSearchColumn("all");
    } else {
      setActiveSearchColumn(column);
      document.querySelector('input[type="text"][placeholder*="Rechercher"]').focus();
    }
  };

  const clearFilter = (column) => {
    setFilterValues({
      ...filterValues,
      [column]: ""
    });
    
    const updatedActiveFilters = { ...activeFilters };
    delete updatedActiveFilters[column];
    setActiveFilters(updatedActiveFilters);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  const filteredSessions = sessions.filter((session) => {
    if (!search) {
      if (Object.keys(activeFilters).length === 0) return true;
    } else if (activeSearchColumn === "all") {
      if (
        !(session.matiere_name && session.matiere_name.toLowerCase().includes(search.toLowerCase())) &&
        !(session.professeur_name && `${session.professeur_name} ${session.professeur_firstname}`.toLowerCase().includes(search.toLowerCase())) &&
        !(session.classe_name && session.classe_name.toLowerCase().includes(search.toLowerCase())) &&
        !(session.salle && session.salle.toLowerCase().includes(search.toLowerCase())) &&
        !formatDate(session.date).toLowerCase().includes(search.toLowerCase()) &&
        !`${formatTime(session.start_time)} - ${formatTime(session.end_time)}`.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
    } else if (activeSearchColumn === "id") {
      if (!String(session.id).toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    } else if (activeSearchColumn === "matiere") {
      if (!session.matiere_name || !session.matiere_name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    } else if (activeSearchColumn === "professeur") {
      const profName = session.professeur_name && session.professeur_firstname ? 
        `${session.professeur_name} ${session.professeur_firstname}` : "";
      if (!profName.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    } else if (activeSearchColumn === "classe") {
      if (!session.classe_name || !session.classe_name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    } else if (activeSearchColumn === "date") {
      if (!formatDate(session.date).toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    } else if (activeSearchColumn === "horaire") {
      const horaire = `${formatTime(session.start_time)} - ${formatTime(session.end_time)}`;
      if (!horaire.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    } else if (activeSearchColumn === "salle") {
      if (!session.salle || !session.salle.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    }

    if (activeFilters.id && filterValues.id && 
        !String(session.id).toLowerCase().includes(filterValues.id.toLowerCase())) {
      return false;
    }

    if (activeFilters.matiere && filterValues.matiere && 
        (!session.matiere_name || !session.matiere_name.toLowerCase().includes(filterValues.matiere.toLowerCase()))) {
      return false;
    }

    if (activeFilters.professeur && filterValues.professeur) {
      const profName = session.professeur_name && session.professeur_firstname ? 
        `${session.professeur_name} ${session.professeur_firstname}` : "";
      if (!profName.toLowerCase().includes(filterValues.professeur.toLowerCase())) {
        return false;
      }
    }

    if (activeFilters.classe && filterValues.classe && 
        (!session.classe_name || !session.classe_name.toLowerCase().includes(filterValues.classe.toLowerCase()))) {
      return false;
    }

    if (activeFilters.date && filterValues.date && 
        !formatDate(session.date).toLowerCase().includes(filterValues.date.toLowerCase())) {
      return false;
    }

    if (activeFilters.horaire && filterValues.horaire) {
      const horaire = `${formatTime(session.start_time)} - ${formatTime(session.end_time)}`;
      if (!horaire.toLowerCase().includes(filterValues.horaire.toLowerCase())) {
        return false;
      }
    }

    if (activeFilters.salle && filterValues.salle && 
        (!session.salle || !session.salle.toLowerCase().includes(filterValues.salle.toLowerCase()))) {
      return false;
    }

    return true;
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortConfig.key === 'id') {
      return sortConfig.direction === 'ascending' 
        ? a.id - b.id 
        : b.id - a.id;
    } else if (sortConfig.key === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortConfig.direction === 'ascending' 
        ? dateA - dateB 
        : dateB - dateA;
    } else if (sortConfig.key === 'horaire' || sortConfig.key === 'start_time') {
      return sortConfig.direction === 'ascending'
        ? a.start_time.localeCompare(b.start_time)
        : b.start_time.localeCompare(a.start_time);
    } else if (sortConfig.key === 'matiere') {
      const nameA = a.matiere_name || "";
      const nameB = b.matiere_name || "";
      return sortConfig.direction === 'ascending'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortConfig.key === 'professeur') {
      const profNameA = a.professeur_name ? `${a.professeur_name} ${a.professeur_firstname}` : "";
      const profNameB = b.professeur_name ? `${b.professeur_name} ${b.professeur_firstname}` : "";
      return sortConfig.direction === 'ascending'
        ? profNameA.localeCompare(profNameB)
        : profNameB.localeCompare(profNameA);
    } else if (sortConfig.key === 'classe') {
      const classeNameA = a.classe_name || "";
      const classeNameB = b.classe_name || "";
      return sortConfig.direction === 'ascending'
        ? classeNameA.localeCompare(classeNameB)
        : classeNameB.localeCompare(classeNameA);
    } else {
      const valueA = a[sortConfig.key] || "";
      const valueB = b[sortConfig.key] || "";
      return sortConfig.direction === 'ascending'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    }
  });

  const totalPages = Math.ceil(sortedSessions.length / itemsPerPage);
  const displayedSessions = sortedSessions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />
      <NavbarMenus />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-[#0a2463]">Gestion des sessions</h1>
        </div>
        
        <div className="flex justify-end mb-4">
          <button
            onClick={openCreateModal}
            className="bg-[#0d47a1] hover:bg-[#0a3880] text-white rounded flex items-center px-4 py-2 transition-colors"
          >
            <Plus size={18} className="mr-2" /> Nouvelle session
          </button>
        </div>
        
        <div className="bg-white rounded-md shadow-sm border border-gray-200 mb-6">
          <div className="p-6 pb-4">
            <div className="relative mx-auto max-w-lg mb-4">
              <input
                type="text"
                placeholder={`Rechercher ${
                  activeSearchColumn === "id" ? "par ID..." : 
                  activeSearchColumn === "matiere" ? "par matière..." :
                  activeSearchColumn === "professeur" ? "par professeur..." :
                  activeSearchColumn === "classe" ? "par classe..." :
                  activeSearchColumn === "date" ? "par date..." :
                  activeSearchColumn === "horaire" ? "par horaires..." :
                  activeSearchColumn === "salle" ? "par salle..." :
                  "une session..."
                }`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {activeSearchColumn !== "all" && (
                  <span className="mr-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {activeSearchColumn === "id" ? "ID" :
                     activeSearchColumn === "matiere" ? "Matière" :
                     activeSearchColumn === "professeur" ? "Professeur" :
                     activeSearchColumn === "classe" ? "Classe" :
                     activeSearchColumn === "date" ? "Date" :
                     activeSearchColumn === "horaire" ? "Horaires" :
                     activeSearchColumn === "salle" ? "Salle" : ""}
                  </span>
                )}
                <Search size={18} className="text-gray-400" />
              </div>
            </div>
          
            {Object.keys(activeFilters).length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {Object.keys(activeFilters).map(column => (
                  <span 
                    key={column}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {column === 'id' ? 'ID' : 
                    column === 'matiere' ? 'Matière' :
                    column === 'professeur' ? 'Professeur' :
                    column === 'classe' ? 'Classe' :
                    column === 'date' ? 'Date' :
                    column === 'horaire' ? 'Horaires' :
                    'Salle'}: {filterValues[column]}
                    <button 
                      onClick={() => clearFilter(column)} 
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <button 
                  onClick={() => {
                    setActiveFilters({});
                    setFilterValues({
                      id: "",
                      matiere: "",
                      professeur: "",
                      classe: "",
                      date: "",
                      horaire: "",
                      salle: ""
                    });
                  }}
                  className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:underline"
                >
                  Effacer tous les filtres
                </button>
              </div>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => requestSort('id')}
                        className="flex items-center hover:text-gray-700"
                      >
                        ID {getSortIcon('id')}
                      </button>
                      <button 
                        onClick={() => toggleFilterColumn('id')}
                        className={`p-1 rounded transition-colors ${activeSearchColumn === 'id' ? 'text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Filter size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => requestSort('matiere')}
                        className="flex items-center hover:text-gray-700"
                      >
                        Matière {getSortIcon('matiere')}
                      </button>
                      <button 
                        onClick={() => toggleFilterColumn('matiere')}
                        className={`p-1 rounded transition-colors ${activeSearchColumn === 'matiere' ? 'text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Filter size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => requestSort('professeur')}
                        className="flex items-center hover:text-gray-700"
                      >
                        Professeur {getSortIcon('professeur')}
                      </button>
                      <button 
                        onClick={() => toggleFilterColumn('professeur')}
                        className={`p-1 rounded transition-colors ${activeSearchColumn === 'professeur' ? 'text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Filter size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => requestSort('classe')}
                        className="flex items-center hover:text-gray-700"
                      >
                        Classe {getSortIcon('classe')}
                      </button>
                      <button 
                        onClick={() => toggleFilterColumn('classe')}
                        className={`p-1 rounded transition-colors ${activeSearchColumn === 'classe' ? 'text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Filter size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => requestSort('date')}
                        className="flex items-center hover:text-gray-700"
                      >
                        Date {getSortIcon('date')}
                      </button>
                      <button 
                        onClick={() => toggleFilterColumn('date')}
                        className={`p-1 rounded transition-colors ${activeSearchColumn === 'date' ? 'text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Filter size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => requestSort('start_time')}
                        className="flex items-center hover:text-gray-700"
                      >
                        Horaires {getSortIcon('start_time')}
                      </button>
                      <button 
                        onClick={() => toggleFilterColumn('horaire')}
                        className={`p-1 rounded transition-colors ${activeSearchColumn === 'horaire' ? 'text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Filter size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => requestSort('salle')}
                        className="flex items-center hover:text-gray-700"
                      >
                        Salle {getSortIcon('salle')}
                      </button>
                      <button 
                        onClick={() => toggleFilterColumn('salle')}
                        className={`p-1 rounded transition-colors ${activeSearchColumn === 'salle' ? 'text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Filter size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedSessions.length > 0 ? (
                  displayedSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-900">{session.id}</td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                          {session.matiere_name}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {session.professeur_name ? 
                          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">
                            {`${session.professeur_name} ${session.professeur_firstname}`}
                          </span> : 
                          <span className="text-sm text-gray-500">Non assigné</span>
                        }
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700">
                          {session.classe_name || "Non assignée"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {formatDate(session.date)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {formatTime(session.start_time)} - {formatTime(session.end_time)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {session.salle || 
                          <span className="text-gray-500 italic">Non assignée</span>
                        }
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800" 
                            onClick={() => openEditModal(session)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800" 
                            onClick={() => deleteSession(session.id)}
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">
                      Aucune session ne correspond à votre recherche
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Affichage de {displayedSessions.length > 0 ? `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, sortedSessions.length)}` : "0"} sur {sortedSessions.length} sessions
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm rounded ${currentPage === 1 ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'}`}
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-4 py-2 text-sm rounded ${currentPage === totalPages || totalPages === 0 ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'}`}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-xl w-full max-w-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-5">
                {isEditing ? "Modifier une session" : "Ajouter une session"}
              </h2>
              
              {error && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matière *</label>
                  <div className="relative matieres-selector">
                    <input
                      type="text"
                      placeholder="Rechercher une matière..."
                      value={searchMatiere}
                      onChange={(e) => setSearchMatiere(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onFocus={() => setShowMatieresList(true)}
                    />
                    {showMatieresList && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded max-h-60 overflow-y-auto shadow-lg">
                        <div className="sticky top-0 bg-gray-100 p-2">
                          <div className="flex gap-2 mb-2">
                            <select 
                              className="p-1 border border-gray-300 rounded text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              onChange={(e) => setFilterClasse(e.target.value)}
                              value={filterClasse}
                            >
                              <option value="">Toutes les classes</option>
                              {[...new Set(matieres.map(m => m.classe_name))].filter(Boolean).map(classeName => (
                                <option key={classeName} value={classeName}>{classeName}</option>
                              ))}
                            </select>
                            <select 
                              className="p-1 border border-gray-300 rounded text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              onChange={(e) => setFilterProf(e.target.value)}
                              value={filterProf}
                            >
                              <option value="">Tous les professeurs</option>
                              {[...new Set(matieres.map(m => m.professeur_id ? `${m.professeur_name} ${m.professeur_firstname}` : null))].filter(Boolean).map(profName => (
                                <option key={profName} value={profName}>{profName}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {filterMatieresResults().length > 0 ? (
                          filterMatieresResults().map((matiere) => (
                            <div
                              key={matiere.id}
                              className="p-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200"
                              onClick={() => {
                                if (isEditing) {
                                  setEditingSession({ ...editingSession, matieres_id: matiere.id });
                                } else {
                                  setNewSession({ ...newSession, matieres_id: matiere.id });
                                }
                                setSelectedMatiereName(`${matiere.name} - ${matiere.classe_name || "Sans classe"} (${matiere.professeur_name ? `${matiere.professeur_name} ${matiere.professeur_firstname}` : "Sans professeur"})`);
                                setShowMatieresList(false);
                              }}
                            >
                              <div className="font-medium">{matiere.name}</div>
                              <div className="text-sm text-gray-600 flex justify-between">
                                <span>{matiere.classe_name || "Sans classe"}</span>
                                <span>{matiere.professeur_name ? `${matiere.professeur_name} ${matiere.professeur_firstname}` : "Sans professeur"}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-gray-500">Aucune matière trouvée</div>
                        )}
                      </div>
                    )}
                    {(isEditing || newSession.matieres_id) && selectedMatiereName && (
                      <div className="mt-2 p-2 bg-gray-100 rounded flex justify-between">
                        <span>{selectedMatiereName}</span>
                        <button 
                          className="text-red-500"
                          onClick={() => {
                            if (isEditing) {
                              setEditingSession({ ...editingSession, matieres_id: "" });
                            } else {
                              setNewSession({ ...newSession, matieres_id: "" });
                            }
                            setSelectedMatiereName("");
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={isEditing ? editingSession.date : newSession.date}
                      onChange={(e) => isEditing 
                        ? setEditingSession({ ...editingSession, date: e.target.value })
                        : setNewSession({ ...newSession, date: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded pl-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début *</label>
                    <div className="relative">
                      <input
                        type="time"
                        value={isEditing ? editingSession.start_time : newSession.start_time}
                        onChange={(e) => isEditing 
                          ? setEditingSession({ ...editingSession, start_time: e.target.value })
                          : setNewSession({ ...newSession, start_time: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded pl-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure de fin *</label>
                    <div className="relative">
                      <input
                        type="time"
                        value={isEditing ? editingSession.end_time : newSession.end_time}
                        onChange={(e) => isEditing 
                          ? setEditingSession({ ...editingSession, end_time: e.target.value })
                          : setNewSession({ ...newSession, end_time: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded pl-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
                  <input
                    type="text"
                    placeholder="Salle (optionnel)"
                    value={isEditing ? editingSession.salle : newSession.salle}
                    onChange={(e) => isEditing 
                      ? setEditingSession({ ...editingSession, salle: e.target.value })
                      : setNewSession({ ...newSession, salle: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={isEditing ? updateSession : addSession}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    {isEditing ? "Mettre à jour" : "Ajouter"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}