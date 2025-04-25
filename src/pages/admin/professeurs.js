import { useState, useEffect } from "react";
import { Plus, Trash, Pencil, Filter, Search, X, ArrowDown, ArrowUp } from "lucide-react";
import Navbar from "../../components/Navbar";
import NavbarMenus from "../../components/NavbarMenus";

export default function AdminProfesseursPage() {
  const [professeurs, setProfesseurs] = useState([]);
  const [search, setSearch] = useState("");
  const [activeSearchColumn, setActiveSearchColumn] = useState("all");
  const [newProfesseur, setNewProfesseur] = useState({ name: "", firstname: "", password: "" });
  const [editingProfesseur, setEditingProfesseur] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});
  const [filterValues, setFilterValues] = useState({
    id: "",
    name: "",
    firstname: ""
  });
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const itemsPerPage = 30;

  useEffect(() => {
    fetchProfesseurs();
  }, []);

  const fetchProfesseurs = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/professeurs`);
      const data = await response.json();
      setProfesseurs(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des professeurs:", error);
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

  const addProfesseur = async () => {
    if (!newProfesseur.name || !newProfesseur.firstname || !newProfesseur.password) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/professeurs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfesseur),
      });
      if (response.ok) {
        fetchProfesseurs();
        setNewProfesseur({ name: "", firstname: "", password: "" });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du professeur:", error);
    }
  };

  const deleteProfesseur = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/professeurs/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      fetchProfesseurs();
    } catch (error) {
      console.error("Erreur lors de la suppression du professeur:", error);
    }
  };

  const updateProfesseur = async () => {
    if (!editingProfesseur.name || !editingProfesseur.firstname) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/professeurs/${editingProfesseur.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProfesseur),
      });
      if (response.ok) {
        fetchProfesseurs();
        setEditingProfesseur(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du professeur:", error);
    }
  };

  const openCreateModal = () => {
    setNewProfesseur({ name: "", firstname: "", password: "" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (professeur) => {
    setEditingProfesseur({ ...professeur, password: "" });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[0-9]/g, '');
    setNewProfesseur({ ...newProfesseur, name: value });
  };

  const handleFirstnameChange = (e) => {
    const value = e.target.value.replace(/[0-9]/g, '');
    setNewProfesseur({ ...newProfesseur, firstname: value });
  };

  const handleEditingNameChange = (e) => {
    const value = e.target.value.replace(/[0-9]/g, '');
    setEditingProfesseur({ ...editingProfesseur, name: value });
  };

  const handleEditingFirstnameChange = (e) => {
    const value = e.target.value.replace(/[0-9]/g, '');
    setEditingProfesseur({ ...editingProfesseur, firstname: value });
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

  const filteredProfesseurs = professeurs.filter(professeur => {
    if (!search) {
      if (Object.keys(activeFilters).length === 0) return true;
    } else if (activeSearchColumn === "all") {
      if (!`${professeur.name} ${professeur.firstname}`.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    } else if (activeSearchColumn === "id") {
      if (!String(professeur.id).toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    } else if (activeSearchColumn === "name") {
      if (!professeur.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    } else if (activeSearchColumn === "firstname") {
      if (!professeur.firstname.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    }

    if (activeFilters.id && filterValues.id && 
        !String(professeur.id).toLowerCase().includes(filterValues.id.toLowerCase())) {
      return false;
    }

    if (activeFilters.name && filterValues.name && 
        !professeur.name.toLowerCase().includes(filterValues.name.toLowerCase())) {
      return false;
    }

    if (activeFilters.firstname && filterValues.firstname && 
        !professeur.firstname.toLowerCase().includes(filterValues.firstname.toLowerCase())) {
      return false;
    }

    return true;
  });

  const sortedProfesseurs = [...filteredProfesseurs].sort((a, b) => {
    if (sortConfig.key === 'id') {
      return sortConfig.direction === 'ascending' 
        ? a.id - b.id 
        : b.id - a.id;
    } else {
      return sortConfig.direction === 'ascending'
        ? String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key]))
        : String(b[sortConfig.key]).localeCompare(String(a[sortConfig.key]));
    }
  });

  const totalPages = Math.ceil(sortedProfesseurs.length / itemsPerPage);
  const displayedProfesseurs = sortedProfesseurs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />
      <NavbarMenus />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-[#0a2463]">Gestion des professeurs</h1>
        </div>
        
        <div className="flex justify-end mb-4">
          <button
            onClick={openCreateModal}
            className="bg-[#0d47a1] hover:bg-[#0a3880] text-white rounded flex items-center px-4 py-2 transition-colors"
          >
            <Plus size={18} className="mr-2" /> Nouveau professeur
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
                  activeSearchColumn === "firstname" ? "par prénom..." :
                  "un professeur..."
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
                     activeSearchColumn === "firstname" ? "Prénom" : ""}
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
                    'Prénom'}: {filterValues[column]}
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
                      firstname: ""
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
                        onClick={() => requestSort('firstname')}
                        className="flex items-center hover:text-gray-700"
                      >
                        Prénom {getSortIcon('firstname')}
                      </button>
                      <button 
                        onClick={() => toggleFilterColumn('firstname')}
                        className={`p-1 rounded transition-colors ${activeSearchColumn === 'firstname' ? 'text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
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
                {displayedProfesseurs.length > 0 ? (
                  displayedProfesseurs.map((professeur) => (
                    <tr key={professeur.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{professeur.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{professeur.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{professeur.firstname}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800" 
                            onClick={() => openEditModal(professeur)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800" 
                            onClick={() => deleteProfesseur(professeur.id)}
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                      Aucun professeur ne correspond à votre recherche
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Affichage de {displayedProfesseurs.length > 0 ? `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, sortedProfesseurs.length)}` : "0"} sur {sortedProfesseurs.length} professeurs
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
              <h2 className="text-xl font-semibold text-gray-800 mb-5">{isEditing ? "Modifier un professeur" : "Ajouter un professeur"}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    placeholder="Nom du professeur"
                    value={isEditing ? editingProfesseur.name : newProfesseur.name}
                    onChange={(e) => isEditing ? handleEditingNameChange(e) : handleNameChange(e)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    placeholder="Prénom du professeur"
                    value={isEditing ? editingProfesseur.firstname : newProfesseur.firstname}
                    onChange={(e) => isEditing ? handleEditingFirstnameChange(e) : handleFirstnameChange(e)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                {(!isEditing || (isEditing && editingProfesseur.password !== undefined)) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isEditing ? "Nouveau mot de passe (facultatif)" : "Mot de passe"}
                    </label>
                    <input
                      type="password"
                      placeholder={isEditing ? "Nouveau mot de passe" : "Mot de passe"}
                      value={isEditing ? editingProfesseur.password : newProfesseur.password}
                      onChange={(e) => 
                        isEditing 
                          ? setEditingProfesseur({ ...editingProfesseur, password: e.target.value }) 
                          : setNewProfesseur({ ...newProfesseur, password: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoComplete="new-password"
                    />
                  </div>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={isEditing ? updateProfesseur : addProfesseur}
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