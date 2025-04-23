import { useState, useEffect } from "react";
import { Plus, Trash, Pencil, Filter, Search, X, ArrowDown, ArrowUp } from "lucide-react";
import Navbar from "../../components/Navbar";
import NavbarMenus from "../../components/NavbarMenus";

export default function AdminMatieresPage() {
  const [matieres, setMatieres] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [activeSearchColumn, setActiveSearchColumn] = useState("all");
  const [newMatiere, setNewMatiere] = useState({ name: "", professeur_id: "", classe_id: "" });
  const [editingMatiere, setEditingMatiere] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});
  const [filterValues, setFilterValues] = useState({
    id: "",
    name: "",
    professeur_id: "",
    classe_id: ""
  });
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const itemsPerPage = 30;

  useEffect(() => {
    fetchMatieres();
    fetchProfesseurs();
    fetchClasses();
  }, []);

  const fetchMatieres = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/matieres`);
      const data = await response.json();
      setMatieres(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des matières:", error);
    }
  };

  const fetchProfesseurs = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/professeurs`);
      const data = await response.json();
      setProfesseurs(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des professeurs:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/classes`);
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des classes:", error);
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

  const addMatiere = async () => {
    if (!newMatiere.name || !newMatiere.classe_id) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/matieres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMatiere),
      });
      if (response.ok) {
        fetchMatieres();
        setNewMatiere({ name: "", professeur_id: "", classe_id: "" });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la matière:", error);
    }
  };

  const deleteMatiere = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/matieres/${id}`, {
        method: "DELETE",
      });
      fetchMatieres();
    } catch (error) {
      console.error("Erreur lors de la suppression de la matière:", error);
    }
  };

  const updateMatiere = async () => {
    if (!editingMatiere.name || !editingMatiere.classe_id) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/matieres/${editingMatiere.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMatiere),
      });
      if (response.ok) {
        fetchMatieres();
        setEditingMatiere(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la matière:", error);
    }
  };

  const openCreateModal = () => {
    setNewMatiere({ name: "", professeur_id: "", classe_id: "" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (matiere) => {
    setEditingMatiere({
      id: matiere.id,
      name: matiere.name,
      professeur_id: matiere.professeur_id || "",
      classe_id: matiere.classe_id || ""
    });
    setIsEditing(true);
    setIsModalOpen(true);
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

  const filteredMatieres = matieres.filter((matiere) => {
    if (!search) {
      if (Object.keys(activeFilters).length === 0) return true;
    } else if (activeSearchColumn === "all") {
      if (!matiere.name.toLowerCase().includes(search.toLowerCase()) &&
          !(matiere.professeur_name && `${matiere.professeur_name} ${matiere.professeur_firstname}`.toLowerCase().includes(search.toLowerCase())) &&
          !(matiere.classe_name && matiere.classe_name.toLowerCase().includes(search.toLowerCase()))) {
        return false;
      }
    } else if (activeSearchColumn === "id") {
      if (!String(matiere.id).toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    } else if (activeSearchColumn === "name") {
      if (!matiere.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    } else if (activeSearchColumn === "professeur_id") {
      const profName = matiere.professeur_name && matiere.professeur_firstname ? 
        `${matiere.professeur_name} ${matiere.professeur_firstname}` : "";
      if (!profName.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    } else if (activeSearchColumn === "classe_id") {
      if (!matiere.classe_name || !matiere.classe_name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    }

    if (activeFilters.id && filterValues.id && 
        !String(matiere.id).toLowerCase().includes(filterValues.id.toLowerCase())) {
      return false;
    }

    if (activeFilters.name && filterValues.name && 
        !matiere.name.toLowerCase().includes(filterValues.name.toLowerCase())) {
      return false;
    }

    if (activeFilters.professeur_id && filterValues.professeur_id) {
      const profName = matiere.professeur_name && matiere.professeur_firstname ? 
        `${matiere.professeur_name} ${matiere.professeur_firstname}` : "";
      if (!profName.toLowerCase().includes(filterValues.professeur_id.toLowerCase())) {
        return false;
      }
    }

    if (activeFilters.classe_id && filterValues.classe_id && 
        (!matiere.classe_name || !matiere.classe_name.toLowerCase().includes(filterValues.classe_id.toLowerCase()))) {
      return false;
    }

    return true;
  });

  const sortedMatieres = [...filteredMatieres].sort((a, b) => {
    if (sortConfig.key === 'id') {
      return sortConfig.direction === 'ascending' 
        ? a.id - b.id 
        : b.id - a.id;
    } else if (sortConfig.key === 'professeur_id') {
      const profNameA = a.professeur_name && a.professeur_firstname ? 
        `${a.professeur_name} ${a.professeur_firstname}` : "";
      const profNameB = b.professeur_name && b.professeur_firstname ? 
        `${b.professeur_name} ${b.professeur_firstname}` : "";
      return sortConfig.direction === 'ascending'
        ? profNameA.localeCompare(profNameB)
        : profNameB.localeCompare(profNameA);
    } else if (sortConfig.key === 'classe_id') {
      const classeNameA = a.classe_name || "";
      const classeNameB = b.classe_name || "";
      return sortConfig.direction === 'ascending'
        ? classeNameA.localeCompare(classeNameB)
        : classeNameB.localeCompare(classeNameA);
    } else {
      return sortConfig.direction === 'ascending'
        ? String(a[sortConfig.key] || "").localeCompare(String(b[sortConfig.key] || ""))
        : String(b[sortConfig.key] || "").localeCompare(String(a[sortConfig.key] || ""));
    }
  });

  const totalPages = Math.ceil(sortedMatieres.length / itemsPerPage);
  const displayedMatieres = sortedMatieres.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />
      <NavbarMenus />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-[#0a2463]">Gestion des matières</h1>
        </div>
        
        <div className="flex justify-end mb-4">
          <button
            onClick={openCreateModal}
            className="bg-[#0d47a1] hover:bg-[#0a3880] text-white rounded flex items-center px-4 py-2 transition-colors"
          >
            <Plus size={18} className="mr-2" /> Nouvelle matière
          </button>
        </div>
        
        <div className="bg-white rounded-md shadow-sm border border-gray-200 mb-6">
          <div className="p-6 pb-4">
            <div className="relative mx-auto max-w-lg mb-4">
              <input
                type="text"
                placeholder={`Rechercher ${
                  activeSearchColumn === "id" ? "par ID..." : 
                  activeSearchColumn === "name" ? "par nom..." :
                  activeSearchColumn === "professeur_id" ? "par professeur..." :
                  activeSearchColumn === "classe_id" ? "par classe..." :
                  "une matière..."
                }`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {activeSearchColumn !== "all" && (
                  <span className="mr-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {activeSearchColumn === "id" ? "ID" :
                     activeSearchColumn === "name" ? "Nom" :
                     activeSearchColumn === "professeur_id" ? "Professeur" :
                     activeSearchColumn === "classe_id" ? "Classe" : ""}
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
                    column === 'name' ? 'Nom' :
                    column === 'professeur_id' ? 'Professeur' :
                    'Classe'}: {filterValues[column]}
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
                      name: "",
                      professeur_id: "",
                      classe_id: ""
                    });
                  }}
                  className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:underline"
                >
                  Effacer tous les filtres
                </button>
              </div>
            )}
          </div>
          
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => requestSort('name')}
                        className="flex items-center hover:text-gray-700"
                      >
                        Nom {getSortIcon('name')}
                      </button>
                      <button 
                        onClick={() => toggleFilterColumn('name')}
                        className={`p-1 rounded transition-colors ${activeSearchColumn === 'name' ? 'text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Filter size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => requestSort('professeur_id')}
                        className="flex items-center hover:text-gray-700"
                      >
                        Professeur {getSortIcon('professeur_id')}
                      </button>
                      <button 
                        onClick={() => toggleFilterColumn('professeur_id')}
                        className={`p-1 rounded transition-colors ${activeSearchColumn === 'professeur_id' ? 'text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Filter size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => requestSort('classe_id')}
                        className="flex items-center hover:text-gray-700"
                      >
                        Classe {getSortIcon('classe_id')}
                      </button>
                      <button 
                        onClick={() => toggleFilterColumn('classe_id')}
                        className={`p-1 rounded transition-colors ${activeSearchColumn === 'classe_id' ? 'text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Filter size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedMatieres.length > 0 ? (
                  displayedMatieres.map((matiere) => (
                    <tr key={matiere.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{matiere.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{matiere.name}</td>
                      <td className="px-6 py-4">
                        {matiere.professeur_id ? 
                          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">
                            {`${matiere.professeur_name} ${matiere.professeur_firstname}`}
                          </span> : 
                          <span className="text-sm text-gray-500">Non assigné</span>
                        }
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                          {matiere.classe_name || "Non assignée"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800" 
                            onClick={() => openEditModal(matiere)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800" 
                            onClick={() => deleteMatiere(matiere.id)}
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                      Aucune matière ne correspond à votre recherche
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Affichage de {displayedMatieres.length > 0 ? `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, sortedMatieres.length)}` : "0"} sur {sortedMatieres.length} matières
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
            <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-5">
                {isEditing ? "Modifier une matière" : "Ajouter une matière"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    placeholder="Nom de la matière"
                    value={isEditing ? editingMatiere.name : newMatiere.name}
                    onChange={(e) => isEditing 
                      ? setEditingMatiere({ ...editingMatiere, name: e.target.value })
                      : setNewMatiere({ ...newMatiere, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Professeur</label>
                  <select
                    value={isEditing ? editingMatiere.professeur_id : newMatiere.professeur_id}
                    onChange={(e) => isEditing 
                      ? setEditingMatiere({ ...editingMatiere, professeur_id: e.target.value || null })
                      : setNewMatiere({ ...newMatiere, professeur_id: e.target.value || null })
                    }
                    className="w-full p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un professeur (optionnel)</option>
                    {professeurs.map((prof) => (
                      <option key={prof.id} value={prof.id}>
                        {prof.name} {prof.firstname}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                  <select
                    value={isEditing ? editingMatiere.classe_id : newMatiere.classe_id}
                    onChange={(e) => isEditing 
                      ? setEditingMatiere({ ...editingMatiere, classe_id: e.target.value })
                      : setNewMatiere({ ...newMatiere, classe_id: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une classe</option>
                    {classes.map((classe) => (
                      <option key={classe.id} value={classe.id}>{classe.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={isEditing ? updateMatiere : addMatiere}
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