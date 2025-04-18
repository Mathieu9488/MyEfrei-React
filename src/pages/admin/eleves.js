import { useState, useEffect } from "react";
import { Plus, Trash, Pencil, ChevronUp, ChevronDown } from "lucide-react";
import Navbar from "../../components/Navbar";
import NavbarMenus from "../../components/NavbarMenus";

export default function AdminElevesPage() {
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [newEleve, setNewEleve] = useState({ name: "", firstname: "", classe_id: "", password: "" });
  const [editingEleve, setEditingEleve] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);
  };

  const sortedEleves = [...eleves].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const filteredEleves = sortedEleves.filter((eleve) =>
    `${eleve.name} ${eleve.firstname}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEleves.length / itemsPerPage);
  const displayedEleves = filteredEleves.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full h-screen relative">
      <Navbar />
      <NavbarMenus />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Gestion des élèves</h1>
          <button
            onClick={openCreateModal}
            className="p-2 0 text-white rounded flex items-center" style={{ backgroundColor: 'rgb(23, 82, 168)' }}
          >
            <Plus size={16} className="mr-2" /> Nouvel élève
          </button>
        </div>
        <div className="flex justify-center mb-4 pb-4">
          <input
            type="text"
            placeholder="Rechercher un élève..."
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
                <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center justify-center">
                    Nom
                    <button className="ml-2 p-1 rounded-full border border-gray-300 w-6 h-6 flex items-center justify-center">
                      {sortColumn === "name" ? (
                        sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      ) : (
                        <span className="block w-3 h-0.5 bg-gray-500"></span>
                      )}
                    </button>
                  </div>
                </th>
                <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort("firstname")}>
                  <div className="flex items-center justify-center">
                    Prénom
                    <button className="ml-2 p-1 rounded-full border border-gray-300 w-6 h-6 flex items-center justify-center">
                      {sortColumn === "firstname" ? (
                        sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      ) : (
                        <span className="block w-3 h-0.5 bg-gray-500"></span>
                      )}
                    </button>
                  </div>
                </th>
                <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort("classe_id")}>
                  <div className="flex items-center justify-center">
                    Classe
                    <button className="ml-2 p-1 rounded-full border border-gray-300 w-6 h-6 flex items-center justify-center">
                      {sortColumn === "classe_id" ? (
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
              {displayedEleves.map((eleve) => (
                <tr key={eleve.id}>
                  <td className="py-2 px-4 border">{eleve.id}</td>
                  <td className="py-2 px-4 border">{eleve.name}</td>
                  <td className="py-2 px-4 border">{eleve.firstname}</td>
                  <td className="py-2 px-4 border">{classes.find(c => c.id === eleve.classe_id)?.name || eleve.classe_id}</td>
                  <td className="py-2 px-4 border text-center whitespace-nowrap"> 
                    <button className="ml-2 p-2 border border-gray-300 rounded" onClick={() => openEditModal(eleve)}>
                      <Pencil size={16} />
                    </button>
                    <button className="ml-2 p-2 border border-red-500 text-red-500 rounded" onClick={() => deleteEleve(eleve.id)}>
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
            disabled={currentPage === totalPages}
            className="p-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">{isEditing ? "Mettre à jour un élève" : "Ajouter un élève"}</h2>
              <input
                type="text"
                placeholder="Nom"
                value={isEditing ? editingEleve.name : newEleve.name}
                onChange={(e) => isEditing ? handleEditingNameChange(e) : handleNameChange(e)}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              />
              <input
                type="text"
                placeholder="Prénom"
                value={isEditing ? editingEleve.firstname : newEleve.firstname}
                onChange={(e) => isEditing ? handleEditingFirstnameChange(e) : handleFirstnameChange(e)}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              />
              <select
                value={isEditing ? editingEleve.classe_id : newEleve.classe_id}
                onChange={(e) => isEditing ? setEditingEleve({ ...editingEleve, classe_id: e.target.value }) : setNewEleve({ ...newEleve, classe_id: e.target.value })}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              >
                <option value="">Sélectionner une classe</option>
                {classes.map((classe) => (
                  <option key={classe.id} value={classe.id}>{classe.name}</option>
                ))}
              </select>
              {!isEditing && (
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={newEleve.password}
                  onChange={(e) => setNewEleve({ ...newEleve, password: e.target.value })}
                  className="mb-4 p-2 border border-gray-300 rounded w-full"
                  autoComplete="new-password"
                />
              )}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-gray-500 text-white rounded"
                >
                  Annuler
                </button>
                <button
                  onClick={isEditing ? updateEleve : addEleve}
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