import { useState, useEffect } from "react";
import { Plus, Trash, Pencil, ChevronUp, ChevronDown, Calendar, Clock } from "lucide-react";
import Navbar from "../../components/Navbar";
import NavbarMenus from "../../components/NavbarMenus";

export default function AdminSessionsPage() {
    const [sessions, setSessions] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const [search, setSearch] = useState("");
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
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState("");
    const itemsPerPage = 10;
    const [searchMatiere, setSearchMatiere] = useState("");
    const [selectedMatiereName, setSelectedMatiereName] = useState("");
    const [showMatieresList, setShowMatieresList] = useState(false);
    const [filterClasse, setFilterClasse] = useState("");
    const [filterProf, setFilterProf] = useState("");

    const filterMatieresResults = () => {
    return matieres.filter(matiere => {
        const matchSearch = matiere.name.toLowerCase().includes(searchMatiere.toLowerCase());
        const matchClasse = !filterClasse || (matiere.classe_name === filterClasse);
        const matchProf = !filterProf || (matiere.professeur_name && `${matiere.professeur_name} ${matiere.professeur_firstname}` === filterProf);
        return matchSearch && matchClasse && matchProf;
    });
    };

    useEffect(() => {
    if (isEditing && editingSession.matieres_id) {
        const selectedMatiere = matieres.find(m => m.id === parseInt(editingSession.matieres_id));
        if (selectedMatiere) {
        setSelectedMatiereName(`${selectedMatiere.name} - ${selectedMatiere.classe_name || "Sans classe"} (${selectedMatiere.professeur_name ? `${selectedMatiere.professeur_name} ${selectedMatiere.professeur_firstname}` : "Sans professeur"})`);
        }
    }
    }, [isEditing, editingSession, matieres]);

  useEffect(() => {
    fetchSessions();
    fetchMatieres();
  }, []);

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

  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);
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

  const getSortedSessions = () => {
    if (!sortColumn) return [...sessions];
    
    return [...sessions].sort((a, b) => {
      let aValue, bValue;
      
      switch(sortColumn) {
        case "matiere":
          aValue = a.matiere_name;
          bValue = b.matiere_name;
          break;
        case "professeur":
          aValue = `${a.professeur_name || ""} ${a.professeur_firstname || ""}`;
          bValue = `${b.professeur_name || ""} ${b.professeur_firstname || ""}`;
          break;
        case "classe":
          aValue = a.classe_name;
          bValue = b.classe_name;
          break;
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "start_time":
          aValue = a.start_time;
          bValue = b.start_time;
          break;
        case "salle":
          aValue = a.salle || "";
          bValue = b.salle || "";
          break;
        default:
          aValue = a[sortColumn];
          bValue = b[sortColumn];
      }
      
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const filteredSessions = getSortedSessions().filter((session) => {
    const searchLower = search.toLowerCase();
    return (
      (session.matiere_name && session.matiere_name.toLowerCase().includes(searchLower)) ||
      (session.professeur_name && `${session.professeur_name} ${session.professeur_firstname}`.toLowerCase().includes(searchLower)) ||
      (session.classe_name && session.classe_name.toLowerCase().includes(searchLower)) ||
      (session.salle && session.salle.toLowerCase().includes(searchLower)) ||
      formatDate(session.date).toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const displayedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full h-screen relative">
      <Navbar />
      <NavbarMenus />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Gestion des sessions</h1>
          <button
            onClick={openCreateModal}
            className="p-2 text-white rounded flex items-center"
            style={{ backgroundColor: "rgb(23, 82, 168)" }}
          >
            <Plus size={16} className="mr-2" /> Nouvelle session
          </button>
        </div>
        <div className="flex justify-center mb-4 pb-4">
          <input
            type="text"
            placeholder="Rechercher une session..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded w-1/2"
          />
        </div>

        <div className="flex justify-center">
          <table className="bg-white max-w-6xl w-full mx-auto text-center">
            <thead>
              <tr>
                <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort("id")}>
                  <div className="flex items-center justify-center">
                    ID
                    <button className="ml-2 p-1 rounded-full border border-gray-300 w-6 h-6 flex items-center justify-center">
                      {sortColumn === "id" ? (
                        sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      ) : (
                        <span className="block w-3 h-0.5 bg-gray-500"></span>
                      )}
                    </button>
                  </div>
                </th>
                <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort("matiere")}>
                  <div className="flex items-center justify-center">
                    Matière
                    <button className="ml-2 p-1 rounded-full border border-gray-300 w-6 h-6 flex items-center justify-center">
                      {sortColumn === "matiere" ? (
                        sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      ) : (
                        <span className="block w-3 h-0.5 bg-gray-500"></span>
                      )}
                    </button>
                  </div>
                </th>
                <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort("professeur")}>
                  <div className="flex items-center justify-center">
                    Professeur
                    <button className="ml-2 p-1 rounded-full border border-gray-300 w-6 h-6 flex items-center justify-center">
                      {sortColumn === "professeur" ? (
                        sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      ) : (
                        <span className="block w-3 h-0.5 bg-gray-500"></span>
                      )}
                    </button>
                  </div>
                </th>
                <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort("classe")}>
                  <div className="flex items-center justify-center">
                    Classe
                    <button className="ml-2 p-1 rounded-full border border-gray-300 w-6 h-6 flex items-center justify-center">
                      {sortColumn === "classe" ? (
                        sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      ) : (
                        <span className="block w-3 h-0.5 bg-gray-500"></span>
                      )}
                    </button>
                  </div>
                </th>
                <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort("date")}>
                  <div className="flex items-center justify-center">
                    Date
                    <button className="ml-2 p-1 rounded-full border border-gray-300 w-6 h-6 flex items-center justify-center">
                      {sortColumn === "date" ? (
                        sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      ) : (
                        <span className="block w-3 h-0.5 bg-gray-500"></span>
                      )}
                    </button>
                  </div>
                </th>
                <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort("start_time")}>
                  <div className="flex items-center justify-center">
                    Horaires
                    <button className="ml-2 p-1 rounded-full border border-gray-300 w-6 h-6 flex items-center justify-center">
                      {sortColumn === "start_time" ? (
                        sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      ) : (
                        <span className="block w-3 h-0.5 bg-gray-500"></span>
                      )}
                    </button>
                  </div>
                </th>
                <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort("salle")}>
                  <div className="flex items-center justify-center">
                    Salle
                    <button className="ml-2 p-1 rounded-full border border-gray-300 w-6 h-6 flex items-center justify-center">
                      {sortColumn === "salle" ? (
                        sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      ) : (
                        <span className="block w-3 h-0.5 bg-gray-500"></span>
                      )}
                    </button>
                  </div>
                </th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedSessions.map((session) => (
                <tr key={session.id}>
                  <td className="py-2 px-4 border">{session.id}</td>
                  <td className="py-2 px-4 border">{session.matiere_name}</td>
                  <td className="py-2 px-4 border">
                    {session.professeur_name ? 
                        `${session.professeur_name} ${session.professeur_firstname}` : 
                        "Non assigné"
                    }
                    </td>
                  <td className="py-2 px-4 border">{session.classe_name || "Non assignée"}</td>
                  <td className="py-2 px-4 border">{formatDate(session.date)}</td>
                  <td className="py-2 px-4 border">
                    {formatTime(session.start_time)} - {formatTime(session.end_time)}
                  </td>
                  <td className="py-2 px-4 border">{session.salle || "Non assignée"}</td>
                  <td className="py-2 px-4 border text-center whitespace-nowrap">
                    <button
                      className="ml-2 p-2 border border-gray-300 rounded"
                      onClick={() => openEditModal(session)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="ml-2 p-2 border border-red-500 text-red-500 rounded"
                      onClick={() => deleteSession(session.id)}
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">
                {isEditing ? "Modifier une session" : "Ajouter une session"}
              </h2>
              
              {error && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Matière *</label>
                <div className="relative matieres-selector">
                    <input
                    type="text"
                    placeholder="Rechercher une matière..."
                    value={searchMatiere}
                    onChange={(e) => setSearchMatiere(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                    onFocus={() => setShowMatieresList(true)}
                    />
                    {showMatieresList && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded max-h-60 overflow-y-auto">
                        <div className="sticky top-0 bg-gray-100 p-2">
                        <div className="flex gap-2 mb-2">
                            <select 
                            className="p-1 border border-gray-300 rounded text-sm flex-1"
                            onChange={(e) => setFilterClasse(e.target.value)}
                            value={filterClasse}
                            >
                            <option value="">Toutes les classes</option>
                            {[...new Set(matieres.map(m => m.classe_name))].filter(Boolean).map(classeName => (
                                <option key={classeName} value={classeName}>{classeName}</option>
                            ))}
                            </select>
                            <select 
                            className="p-1 border border-gray-300 rounded text-sm flex-1"
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
                    {isEditing || newSession.matieres_id ? (
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
                        ×
                        </button>
                    </div>
                    ) : null}
                </div>
                </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Date *</label>
                <div className="relative">
                  <input
                    type="date"
                    value={isEditing ? editingSession.date : newSession.date}
                    onChange={(e) => isEditing 
                      ? setEditingSession({ ...editingSession, date: e.target.value })
                      : setNewSession({ ...newSession, date: e.target.value })
                    }
                    className="p-2 border border-gray-300 rounded w-full pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              
              <div className="flex gap-4 mb-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 mb-1">Heure de début *</label>
                  <div className="relative">
                    <input
                      type="time"
                      value={isEditing ? editingSession.start_time : newSession.start_time}
                      onChange={(e) => isEditing 
                        ? setEditingSession({ ...editingSession, start_time: e.target.value })
                        : setNewSession({ ...newSession, start_time: e.target.value })
                      }
                      className="p-2 border border-gray-300 rounded w-full pl-10"
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 mb-1">Heure de fin *</label>
                  <div className="relative">
                    <input
                      type="time"
                      value={isEditing ? editingSession.end_time : newSession.end_time}
                      onChange={(e) => isEditing 
                        ? setEditingSession({ ...editingSession, end_time: e.target.value })
                        : setNewSession({ ...newSession, end_time: e.target.value })
                      }
                      className="p-2 border border-gray-300 rounded w-full pl-10"
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Salle</label>
                <input
                  type="text"
                  placeholder="Salle (optionnel)"
                  value={isEditing ? editingSession.salle : newSession.salle}
                  onChange={(e) => isEditing 
                    ? setEditingSession({ ...editingSession, salle: e.target.value })
                    : setNewSession({ ...newSession, salle: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-gray-500 text-white rounded"
                >
                  Annuler
                </button>
                <button
                  onClick={isEditing ? updateSession : addSession}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  {isEditing ? "Mettre à jour" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}