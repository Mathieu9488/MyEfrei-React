import { useState, useEffect } from "react";
import { Plus, Trash, Pencil, ChevronUp, ChevronDown } from "lucide-react";
import Navbar from "../../components/Navbar";
import NavbarMenus from "../../components/NavbarMenus";

export default function AdminMatieresPage() {
  const [matieres, setMatieres] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [newMatiere, setNewMatiere] = useState({ name: "", professeur_id: "", classe_id: "" });
  const [editingMatiere, setEditingMatiere] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);
  };

  const sortedMatieres = [...matieres].sort((a, b) => {
    if (sortColumn) {
      const aValue = sortColumn === "professeur" 
        ? `${a.professeur_name || ""} ${a.professeur_firstname || ""}`
        : sortColumn === "classe" ? a.classe_name : a[sortColumn];
      const bValue = sortColumn === "professeur" 
        ? `${b.professeur_name || ""} ${b.professeur_firstname || ""}`
        : sortColumn === "classe" ? b.classe_name : b[sortColumn];
      
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const filteredMatieres = sortedMatieres.filter((matiere) =>
    matiere.name.toLowerCase().includes(search.toLowerCase()) ||
    (matiere.professeur_name && `${matiere.professeur_name} ${matiere.professeur_firstname}`.toLowerCase().includes(search.toLowerCase())) ||
    (matiere.classe_name && matiere.classe_name.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredMatieres.length / itemsPerPage);
  const displayedMatieres = filteredMatieres.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full h-screen relative">
      <Navbar />
      <NavbarMenus />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Gestion des matières</h1>
          <button
            onClick={openCreateModal}
            className="p-2 text-white rounded flex items-center"
            style={{ backgroundColor: "rgb(23, 82, 168)" }}
          >
            <Plus size={16} className="mr-2" /> Nouvelle matière
          </button>
        </div>
        <div className="flex justify-center mb-4 pb-4">
          <input
            type="text"
            placeholder="Rechercher une matière..."
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
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedMatieres.map((matiere) => (
                <tr key={matiere.id}>
                  <td className="py-2 px-4 border">{matiere.id}</td>
                  <td className="py-2 px-4 border">{matiere.name}</td>
                  <td className="py-2 px-4 border">
                    {matiere.professeur_id ? 
                      `${matiere.professeur_name} ${matiere.professeur_firstname}` : 
                      "Non assigné"
                    }
                  </td>
                  <td className="py-2 px-4 border">{matiere.classe_name || "Non assignée"}</td>
                  <td className="py-2 px-4 border text-center whitespace-nowrap">
                    <button
                      className="ml-2 p-2 border border-gray-300 rounded"
                      onClick={() => openEditModal(matiere)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="ml-2 p-2 border border-red-500 text-red-500 rounded"
                      onClick={() => deleteMatiere(matiere.id)}
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
                {isEditing ? "Mettre à jour une matière" : "Ajouter une matière"}
              </h2>
              <input
                type="text"
                placeholder="Nom de la matière"
                value={isEditing ? editingMatiere.name : newMatiere.name}
                onChange={(e) => isEditing 
                  ? setEditingMatiere({ ...editingMatiere, name: e.target.value })
                  : setNewMatiere({ ...newMatiere, name: e.target.value })
                }
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              />
              <select
                value={isEditing ? editingMatiere.professeur_id : newMatiere.professeur_id}
                onChange={(e) => isEditing 
                  ? setEditingMatiere({ ...editingMatiere, professeur_id: e.target.value || null })
                  : setNewMatiere({ ...newMatiere, professeur_id: e.target.value || null })
                }
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              >
                <option value="">Sélectionner un professeur (optionnel)</option>
                {professeurs.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.name} {prof.firstname}
                  </option>
                ))}
              </select>
              <select
                value={isEditing ? editingMatiere.classe_id : newMatiere.classe_id}
                onChange={(e) => isEditing 
                  ? setEditingMatiere({ ...editingMatiere, classe_id: e.target.value })
                  : setNewMatiere({ ...newMatiere, classe_id: e.target.value })
                }
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              >
                <option value="">Sélectionner une classe</option>
                {classes.map((classe) => (
                  <option key={classe.id} value={classe.id}>{classe.name}</option>
                ))}
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-gray-500 text-white rounded"
                >
                  Annuler
                </button>
                <button
                  onClick={isEditing ? updateMatiere : addMatiere}
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