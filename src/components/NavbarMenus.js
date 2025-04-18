import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from '../context/AuthContext'; // Importez le hook useAuth
import { useNavigate } from 'react-router-dom'; // Importez le hook useNavigate

export default function NavbarMenus() {
  const [active, setActive] = useState("PLANNING");
  const { auth } = useAuth(); // Accédez au rôle de l'utilisateur
  const navigate = useNavigate(); // Utilisez le hook useNavigate

  // Définir les éléments de menu en fonction du rôle de l'utilisateur
  const getMenuItems = () => {
    switch (auth?.role) {
      case 'admin':
        return [
          "ACCUEIL",
          "GESTION DES ÉLÈVES",
          "GESTION DES CLASSES",
          "GESTION DES PROFESSEURS",
          "GESTION DES MATIÈRES",
          "GESTION DES COURS"
        ];
      case 'prof':
        return [
          "PLANNING",
          "COURS",
          "NOTES",
          "MESSAGES",
        ];
      case 'eleve':
        return [
          "ACCUEIL",
          "PLANNING",
          "SCOLARITÉ",
          "L'ÉCOLE",
          "VIE ÉTUDIANTE",
          "STAGES ET ALTERNANCES",
          "OUTILS",
          "AIDES",
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  // Fonction pour gérer la navigation
  const handleNavigation = (item) => {
    setActive(item);
    switch (item) {
      case 'ACCUEIL':
        navigate('/portal');
        break;
      case 'GESTION DES ÉLÈVES':
        navigate('/admin/eleves');
        break;
      case 'RAPPORTS':
        navigate('/admin/reports');
        break;
      case 'PARAMÈTRES':
        navigate('/admin/settings');
        break;
      case 'PLANNING':
        navigate('/prof/planning');
        break;
      case 'COURS':
        navigate('/prof/courses');
        break;
      case 'NOTES':
        navigate('/prof/grades');
        break;
      case 'MESSAGES':
        navigate('/prof/messages');
        break;
      case 'SCOLARITÉ':
        navigate('/eleve/school');
        break;
      case 'L\'ÉCOLE':
        navigate('/eleve/school-info');
        break;
      case 'VIE ÉTUDIANTE':
        navigate('/eleve/student-life');
        break;
      case 'STAGES ET ALTERNANCES':
        navigate('/eleve/internships');
        break;
      case 'OUTILS':
        navigate('/eleve/tools');
        break;
      case 'AIDES':
        navigate('/eleve/help');
        break;
      default:
        break;
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm p-4">
      <ul className="flex justify-center space-x-6 text-gray-500 uppercase text-sm font-semibold">
        {menuItems.map((item) => (
          <li key={item} className="relative">
            <button
              className={`hover:text-orange-500 transition ${
                active === item ? "text-orange-500" : ""
              }`}
              onClick={() => handleNavigation(item)} // Utilisez handleNavigation pour changer de page
            >
              {item}
              {["SCOLARITÉ", "L'ÉCOLE", "VIE ÉTUDIANTE", "STAGES ET ALTERNANCES", "OUTILS", "AIDES"].includes(item) && (
                <ChevronDown size={16} className="inline ml-1" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}