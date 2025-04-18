import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, { id: parseInt(id), password });
      console.log(response.data);
      login(response.data.token, response.data.user);
      // Rediriger l'utilisateur vers la page appropriée en fonction de son rôle
      const role = response.data.user.role;
      if (role === 'admin') {
        navigate('/admin-pannel');
      } else if (role === 'prof') {
        navigate('/planning');
      } else {
        navigate('/portal');
      }
    } catch (error) {
      // Afficher le message d'erreur en cas d'échec
      setErrorMessage("Informations de connexion incorrectes");
    }
  };

  return (
    <div
      className="flex h-screen w-full items-center justify-center"
      style={{ backgroundImage: "url('/images/background_owls.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full absolute" style={{ right: '12%' }}>
        {/* Logo */}
        <div className="flex mb-6">
          <img src="/images/logo-myefrei.png" alt="Efrei Logo" className="h-16" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Connexion</h2>
        <p className="text-gray-600 mb-6">Utiliser votre compte Efrei</p>

        {/* Identifiant */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Identifiant ou n° de dossier</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Votre identifiant"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        {/* Mot de passe */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-1">Mot de passe</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute top-2/3 right-3 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="mb-4 text-red-500">
            {errorMessage}
          </div>
        )}

        {/* Lien Identifiants oubliés */}
        <div className="text-sm text-blue-500 mb-4">
          <a href="tel:+33123456789">Identifiants oubliés ? Contactez-nous</a>
        </div>

        {/* Bouton Connexion */}
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          onClick={handleLogin}
        >
          SE CONNECTER
        </button>

        {/* Conditions d'utilisation */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          En me connectant, j'accepte les conditions d'utilisation.
        </p>
      </div>
    </div>
  );
}