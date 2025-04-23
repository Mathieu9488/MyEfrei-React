import { useState, useEffect } from "react";
import { Plus, Trash, Pencil, Filter, Search, X, ArrowDown, ArrowUp } from "lucide-react";
import Navbar from "../../components/Navbar";
import NavbarMenus from "../../components/NavbarMenus";

export default function AdminElevesPage() {
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [activeSearchColumn, setActiveSearchColumn] = useState("all");
  const [newEleve, setNewEleve] = useState({ name: "", firstname: "", classe_id: "", password: "" });
  const [editingEleve, setEditingEleve] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});
  const [filterValues, setFilterValues] = useState({
    id: "",
    name: "",
    firstname: "",
    classe_id: []
  });
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const itemsPerPage = 30;

  useEffect(() => {
    fetchEleves();
    fetchClasses();
  }, []);

  const fetchEleves = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/eleves`);
    const data = await response.json();
    setEleves(data);
  };

  const fetchClasses = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/classes`);
    const data = await response.json();
    setClasses(data);
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

  const addEleve = async () => {
    if (!newEleve.name || !newEleve.firstname || !newEleve.classe_id || !newEleve.password) return;
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/eleves`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEleve),
    });
    if (response.ok) {
      fetchEleves();
      setNewEleve({ name: "", firstname: "", classe_id: "", password: "" });
      setIsModalOpen(false);
    }
  };

  const deleteEleve = async (id) => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/eleves`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchEleves();
  };

  const updateEleve = async () => {
    if (!editingEleve.name || !editingEleve.firstname || !editingEleve.classe_id) return;
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/eleves/${editingEleve.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingEleve),
    });
    if (response.ok) {
      fetchEleves();
      setEditingEleve(null);
      setIsModalOpen(false);
    }
  };

  const openCreateModal = () => {
    setNewEleve({ name: "", firstname: "", classe_id: "", password: "" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (eleve) => {
    setEditingEleve(eleve);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[0-9]/g, '');
    setNewEleve({ ...newEleve, name: value });
  };

  const handleFirstnameChange = (e) => {
    const value = e.target.value.replace(/[0-9]/g, '');
    setNewEleve({ ...newEleve, firstname: value });
  };

  const handleEditingNameChange = (e) => {
    const value = e.target.value.replace(/[0-9]/g, '');
    setEditingEleve({ ...editingEleve, name: value });
  };

  const handleEditingFirstnameChange = (e) => {
    const value = e.target.value.replace(/[0-9]/g, '');
    setEditingEleve({ ...editingEleve, firstname: value });
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
      [column]: column === 'classe_id' ? [] : ""
    });
    
    const updatedActiveFilters = { ...activeFilters };
    delete updatedActiveFilters[column];
    setActiveFilters(updatedActiveFilters);
  };

  const filteredEleves = eleves.filter(eleve => {
    if (!search) {
      if (Object.keys(activeFilters).length === 0) return true;
    } else if (activeSearchColumn === "all") {
      if (!`${eleve.name} ${eleve.firstname}`.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    } else if (activeSearchColumn === "id") {
      if (!String(eleve.id).toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    } else if (activeSearchColumn === "name") {
      if (!eleve.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    } else if (activeSearchColumn === "firstname") {
      if (!eleve.firstname.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    } else if (activeSearchColumn === "classe_id") {
      const className = classes.find(c => c.id === eleve.classe_id)?.name || '';
      if (!className.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    }

    if (activeFilters.id && filterValues.id && 
        !String(eleve.id).toLowerCase().includes(filterValues.id.toLowerCase())) {
      return false;
    }

    if (activeFilters.name && filterValues.name && 
        !eleve.name.toLowerCase().includes(filterValues.name.toLowerCase())) {
      return false;
    }

    if (activeFilters.firstname && filterValues.firstname && 
        !eleve.firstname.toLowerCase().includes(filterValues.firstname.toLowerCase())) {
      return false;
    }

    if (activeFilters.classe_id && filterValues.classe_id.length > 0 && 
        !filterValues.classe_id.includes(eleve.classe_id)) {
      return false;
    }

    return true;
  });

  const sortedEleves = [...filteredEleves].sort((a, b) => {
    if (sortConfig.key === 'id') {
      return sortConfig.direction === 'ascending' 
        ? a.id - b.id 
        : b.id - a.id;
    } else if (sortConfig.key === 'classe_id') {
      const classNameA = classes.find(c => c.id === a.classe_id)?.name || '';
      const classNameB = classes.find(c => c.id === b.classe_id)?.name || '';
      return sortConfig.direction === 'ascending'
        ? classNameA.localeCompare(classNameB)
        : classNameB.localeCompare(classNameA);
    } else {
      return sortConfig.direction === 'ascending'
        ? String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key]))
        : String(b[sortConfig.key]).localeCompare(String(a[sortConfig.key]));
    }
  });

  const totalPages = Math.ceil(sortedEleves.length / itemsPerPage);
  const displayedEleves = sortedEleves.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />
      <NavbarMenus />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-[#0a2463]">Gestion des élèves</h1>
        </div>
        
        <div className="flex justify-end mb-4">
          <button
            onClick={openCreateModal}
            className="bg-[#0d47a1] hover:bg-[#0a3880] text-white rounded flex items-center px-4 py-2 transition-colors"
          >
            <Plus size={18} className="mr-2" /> Nouvel élève
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
                  activeSearchColumn === "classe_id" ? "par classe..." :
                  "un élève..."
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
                     activeSearchColumn === "firstname" ? "Prénom" :
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
                    column === 'firstname' ? 'Prénom' : 'Classe'}: 
                    {column === 'classe_id' 
                      ? ` ${filterValues.classe_id.length} sélectionné(s)` 
                      : ` ${filterValues[column]}`}
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
                      firstname: "",
                      classe_id: []
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
                {displayedEleves.length > 0 ? (
                  displayedEleves.map((eleve) => (
                    <tr key={eleve.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{eleve.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{eleve.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{eleve.firstname}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                          {classes.find(c => c.id === eleve.classe_id)?.name || eleve.classe_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800" 
                            onClick={() => openEditModal(eleve)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800" 
                            onClick={() => deleteEleve(eleve.id)}
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
                      Aucun élève ne correspond à votre recherche
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Affichage de {displayedEleves.length > 0 ? `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, sortedEleves.length)}` : "0"} sur {sortedEleves.length} élèves
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
              <h2 className="text-xl font-semibold text-gray-800 mb-5">{isEditing ? "Modifier un élève" : "Ajouter un élève"}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    placeholder="Nom de l'élève"
                    value={isEditing ? editingEleve.name : newEleve.name}
                    onChange={(e) => isEditing ? handleEditingNameChange(e) : handleNameChange(e)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    placeholder="Prénom de l'élève"
                    value={isEditing ? editingEleve.firstname : newEleve.firstname}
                    onChange={(e) => isEditing ? handleEditingFirstnameChange(e) : handleFirstnameChange(e)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                  <select
                    value={isEditing ? editingEleve.classe_id : newEleve.classe_id}
                    onChange={(e) => isEditing ? setEditingEleve({ ...editingEleve, classe_id: e.target.value }) : setNewEleve({ ...newEleve, classe_id: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une classe</option>
                    {classes.map((classe) => (
                      <option key={classe.id} value={classe.id}>{classe.name}</option>
                    ))}
                  </select>
                </div>
                {!isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                    <input
                      type="password"
                      placeholder="Mot de passe"
                      value={newEleve.password}
                      onChange={(e) => setNewEleve({ ...newEleve, password: e.target.value })}
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
                    onClick={isEditing ? updateEleve : addEleve}
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