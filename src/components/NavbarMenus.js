import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavbarMenus() {
  const [active, setActive] = useState("");
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    switch (auth?.role) {
      case 'admin':
        return [
          "ACCUEIL",
          "GESTION DES ÉLÈVES",
          "GESTION DES CLASSES",
          "GESTION DES PROFESSEURS",
          "GESTION DES MATIÈRES",
          "GESTION DES SESSIONS",
        ];
      case 'prof':
        return [
          "ACCUEIL",
          "PLANNING",
          "NOTES",
        ];
      case 'eleve':
        return [
          "ACCUEIL",
          "PLANNING",
          "NOTES",
          "CAMPUS",
        ];
      default:
        return [];
    }
  };

  const getActiveItemFromPath = (path) => {
    if (path === '/portal') return 'ACCUEIL';
    if (path === '/admin/eleves') return 'GESTION DES ÉLÈVES';
    if (path === '/admin/classes') return 'GESTION DES CLASSES';
    if (path === '/admin/professeurs') return 'GESTION DES PROFESSEURS';
    if (path === '/admin/matieres') return 'GESTION DES MATIÈRES';
    if (path === '/admin/sessions') return 'GESTION DES SESSIONS';
    if (path === '/admin/reports') return 'RAPPORTS';
    if (path === '/admin/settings') return 'PARAMÈTRES';
    if (path === '/planning') return 'PLANNING';
    if (path === '/prof/courses') return 'COURS';
    if (path === '/prof/notes') return 'NOTES';
    if (path === '/prof/messages') return 'MESSAGES';
    if (path === '/eleve/school') return 'CAMPUS';
    return '';
  };

  useEffect(() => {
    const currentActive = getActiveItemFromPath(location.pathname);
    setActive(currentActive);
  }, [location.pathname]);

  const menuItems = getMenuItems();

  const handleNavigation = (item) => {
    setActive(item);
    if (item === 'NOTES') {
      if (auth?.role === 'prof') {
        navigate('/prof/notes');
      } else if (auth?.role === 'eleve') {
        navigate('/eleve/notes');
      }
      return;
    }
    switch (item) {
      case 'ACCUEIL':
        navigate('/portal');
        break;
      case 'GESTION DES ÉLÈVES':
        navigate('/admin/eleves');
        break;
      case 'GESTION DES CLASSES':
        navigate('/admin/classes');
        break;
      case 'GESTION DES PROFESSEURS':
        navigate('/admin/professeurs');
        break;
      case 'GESTION DES MATIÈRES':
        navigate('/admin/matieres');
        break;
      case 'GESTION DES SESSIONS':
        navigate('/admin/sessions');
        break;
      case 'RAPPORTS':
        navigate('/admin/reports');
        break;
      case 'PARAMÈTRES':
        navigate('/admin/settings');
        break;
      case 'PLANNING':
        navigate('/planning');
        break;
      case 'COURS':
        navigate('/prof/courses');
        break;
      case 'MESSAGES':
        navigate('/prof/messages');
        break;
      case 'CAMPUS':
        navigate('/eleve/school');
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
              onClick={() => handleNavigation(item)}
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