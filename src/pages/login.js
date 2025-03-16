import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen w-full">
      {/* Section gauche avec image */}
      <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/random/800x600/?owl')" }}></div>
      
      {/* Section droite avec formulaire */}
      <div className="w-1/2 flex items-center justify-center bg-white p-10 rounded-lg shadow-lg">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/Logo_efrei.png" alt="Efrei Logo" className="h-10" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connexion</h2>
          <p className="text-gray-600 mb-6">Utiliser votre compte Efrei</p>

          {/* Identifiant */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Identifiant ou n° de dossier</label>
            <input type="text" className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300" placeholder="Votre identifiant" />
          </div>

          {/* Mot de passe */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 mb-1">Mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Votre mot de passe"
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Lien Identifiants oubliés */}
          <div className="text-sm text-blue-500 mb-4">
            <a href="#">Identifiants oubliés ? Contactez-nous</a>
          </div>

          {/* Bouton Connexion */}
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            SE CONNECTER
          </button>

          {/* Conditions d'utilisation */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            En me connectant, j'accepte les <a href="#" className="text-blue-500">conditions d'utilisation</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
