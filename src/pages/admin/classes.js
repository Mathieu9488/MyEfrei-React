import { useState, useEffect } from "react";
import { Plus, Trash, Pencil } from "lucide-react";
import Navbar from "../../components/Navbar";
import NavbarMenus from "../../components/NavbarMenus";

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({ name: "" });
  const [editingClass, setEditingClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/classes`);
    const data = await response.json();
    setClasses(data);
  };

  const addClass = async () => {
    if (!newClass.name) return;
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/classes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClass),
    });
    if (response.ok) {
      fetchClasses();
      setNewClass({ name: "" });
      setIsModalOpen(false);
    }
  };

  const deleteClass = async (id) => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/classes/${id}`, {
      method: "DELETE",
    });
    fetchClasses();
  };

  const updateClass = async () => {
    if (!editingClass.name) return;
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/classes/${editingClass.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingClass),
    });
    if (response.ok) {
      fetchClasses();
      setEditingClass(null);
      setIsModalOpen(false);
    }
  };

  const openCreateModal = () => {
    setNewClass({ name: "" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (classe) => {
    setEditingClass(classe);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full h-screen relative">
      <Navbar />
      <NavbarMenus />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Gestion des classes</h1>
          <button
            onClick={openCreateModal}
            className="p-2 text-white rounded flex items-center"
            style={{ backgroundColor: "rgb(23, 82, 168)" }}
          >
            <Plus size={16} className="mr-2" /> Nouvelle classe
          </button>
        </div>
        <div className="flex justify-center">
          <table className="bg-white max-w-6xl w-full mx-auto text-center">
            <thead>
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Nom</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classe) => (
                <tr key={classe.id}>
                  <td className="py-2 px-4 border">{classe.id}</td>
                  <td className="py-2 px-4 border">{classe.name}</td>
                  <td className="py-2 px-4 border text-center whitespace-nowrap">
                    <button
                      className="ml-2 p-2 border border-gray-300 rounded"
                      onClick={() => openEditModal(classe)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="ml-2 p-2 border border-red-500 text-red-500 rounded"
                      onClick={() => deleteClass(classe.id)}
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">
                {isEditing ? "Mettre à jour une classe" : "Ajouter une classe"}
              </h2>
              <input
                type="text"
                placeholder="Nom"
                value={isEditing ? editingClass.name : newClass.name}
                onChange={(e) =>
                  isEditing
                    ? setEditingClass({ ...editingClass, name: e.target.value })
                    : setNewClass({ ...newClass, name: e.target.value })
                }
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-gray-500 text-white rounded"
                >
                  Annuler
                </button>
                <button
                  onClick={isEditing ? updateClass : addClass}
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