import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../../components/Navbar';
import NavbarMenus from '../../components/NavbarMenus';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SchoolPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({
    laMaison: false,
    laFactory: false,
    lAquarium: false,
    bordeaux: false
  });
  const [selectedSite, setSelectedSite] = useState('laMaison'); // Default to La maison

  // Toggle a section open/closed without affecting the map selection
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Select site for map display without toggling the section
  const selectMapSite = (site) => {
    setSelectedSite(site);
  };

  // Combined function to both select map site and toggle section
  const handleSiteClick = (site) => {
    selectMapSite(site);
    toggleSection(site);
  };

  useEffect(() => {
    if (!auth || !auth.user) {
      navigate('/login');
    }
  }, [auth, navigate]);

  // Map sources with different markers for each site
  const mapSources = {
    laMaison: `https://www.openstreetmap.org/export/embed.html?bbox=2.358,48.784,2.368,48.792&layer=mapnik&marker=48.7853,2.3628`,
    laFactory: `https://www.openstreetmap.org/export/embed.html?bbox=2.358,48.784,2.368,48.792&layer=mapnik&marker=48.7874,2.3637`,
    lAquarium: `https://www.openstreetmap.org/export/embed.html?bbox=2.358,48.784,2.368,48.792&layer=mapnik&marker=48.7885,2.3645`,
    bordeaux: `https://www.openstreetmap.org/export/embed.html?bbox=-0.5565,44.8566,-0.5465,44.8666&layer=mapnik&marker=44.8615,-0.5515`
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />
      <NavbarMenus />
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#0a2463]">Nos campus</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Map section */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:w-3/5">
            <div className="relative overflow-hidden rounded-lg h-[400px] mb-4">
              <iframe
                title="Efrei Campus Map"
                className="w-full h-full border-0"
                src={mapSources[selectedSite]}
                allowFullScreen
              ></iframe>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              <span>© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors</span>
            </div>
          </div>
          {/* Campus info section */}
          <div className="lg:w-2/5">
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b border-gray-200">
                <button 
                  className="w-full p-4 text-left font-bold text-lg flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <span className="text-blue-900">Campus Paris</span>
                  </div>
                </button>
              </div>
              
              {/* Site La maison */}
              <div className="border-b border-gray-200">
                <button 
                  className={`w-full p-4 text-left flex justify-between items-center ${selectedSite === 'laMaison' ? 'bg-blue-50' : ''}`}
                  onClick={() => handleSiteClick('laMaison')}
                >
                  <div className="flex items-center">
                    <span className={`font-semibold ${selectedSite === 'laMaison' ? 'text-blue-900' : ''}`}>Site La maison</span>
                    <span className="text-gray-500 ml-2">Bat. A à F</span>
                  </div>
                  {openSections.laMaison ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {openSections.laMaison && (
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold">Adresse</h3>
                      <p className="flex items-start">
                        <MapPin size={18} className="mr-2 mt-1 text-blue-900 flex-shrink-0" />
                        <span>30-32 Av. de la République,<br />94800 Villejuif</span>
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">Horaires</h3>
                      <p className="flex items-start">
                        <Clock size={18} className="mr-2 mt-1 text-blue-900 flex-shrink-0" />
                        <span>Lundi au vendredi : 7h30 à 20h (18h pour l'accueil)</span>
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">Contact de l'accueil</h3>
                      <p className="flex items-center">
                        <Phone size={18} className="mr-2 text-blue-900 flex-shrink-0" />
                        <span>Accueil : +33 188 289 000</span>
                      </p>
                      <p className="flex items-center">
                        <Mail size={18} className="mr-2 text-blue-900 flex-shrink-0" />
                        <span>accueil@efrei.fr</span>
                      </p>
                      <p className="flex items-center">
                        <Phone size={18} className="mr-2 text-blue-900 flex-shrink-0" />
                        <span>Gardien : +33 626 096 241</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Site La Factory */}
              <div className="border-b border-gray-200">
                <button 
                  className={`w-full p-4 text-left flex justify-between items-center ${selectedSite === 'laFactory' ? 'bg-blue-50' : ''}`}
                  onClick={() => handleSiteClick('laFactory')}
                >
                  <div className="flex items-center">
                    <span className={`font-semibold ${selectedSite === 'laFactory' ? 'text-blue-900' : ''}`}>Site La Factory</span>
                    <span className="text-gray-500 ml-2">Bat. H</span>
                  </div>
                  {openSections.laFactory ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {openSections.laFactory && (
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold">Adresse</h3>
                      <p className="flex items-start">
                        <MapPin size={18} className="mr-2 mt-1 text-blue-900 flex-shrink-0" />
                        <span>147 Bd Maxime Gorki,<br />94800 Villejuif</span>
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">Horaires</h3>
                      <p className="flex items-start">
                        <Clock size={18} className="mr-2 mt-1 text-blue-900 flex-shrink-0" />
                        <span>Lundi au vendredi : 7h30 à 20h (18h pour l'accueil)</span>
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">Contact de l'accueil</h3>
                      <p className="flex items-center">
                        <Phone size={18} className="mr-2 text-blue-900 flex-shrink-0" />
                        <span>Accueil : +33 188 289 000</span>
                      </p>
                      <p className="flex items-center">
                        <Mail size={18} className="mr-2 text-blue-900 flex-shrink-0" />
                        <span>accueil@efrei.fr</span>
                      </p>
                      <p className="flex items-center">
                        <Phone size={18} className="mr-2 text-blue-900 flex-shrink-0" />
                        <span>Gardien : +33 626 096 241</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Site L'aquarium */}
              <div className="border-b border-gray-200">
                <button 
                  className={`w-full p-4 text-left flex justify-between items-center ${selectedSite === 'lAquarium' ? 'bg-blue-50' : ''}`}
                  onClick={() => handleSiteClick('lAquarium')}
                >
                  <div className="flex items-center">
                    <span className={`font-semibold ${selectedSite === 'lAquarium' ? 'text-blue-900' : ''}`}>Site L'aquarium</span>
                    <span className="text-gray-500 ml-2">Bat. K</span>
                  </div>
                  {openSections.lAquarium ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {openSections.lAquarium && (
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold">Adresse</h3>
                      <p className="flex items-start">
                        <MapPin size={18} className="mr-2 mt-1 text-blue-900 flex-shrink-0" />
                        <span>136 bis Bd Maxime Gorki,<br />94800 Villejuif</span>
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">Horaires</h3>
                      <p className="flex items-start">
                        <Clock size={18} className="mr-2 mt-1 text-blue-900 flex-shrink-0" />
                        <span>Lundi au vendredi : 7h30 à 20h (16h30 pour l'accueil)</span>
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">Contact de l'accueil</h3>
                      <p className="flex items-center">
                        <Phone size={18} className="mr-2 text-blue-900 flex-shrink-0" />
                        <span>Accueil : +33 188 289 000</span>
                      </p>
                      <p className="flex items-center">
                        <Mail size={18} className="mr-2 text-blue-900 flex-shrink-0" />
                        <span>accueil@efrei.fr</span>
                      </p>
                      <p className="flex items-center">
                        <Phone size={18} className="mr-2 text-blue-900 flex-shrink-0" />
                        <span>Gardien : +33 188 289 311</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Campus Bordeaux */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200">
                <button 
                  className="w-full p-4 text-left font-bold text-lg flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <span className="text-blue-900">Campus Bordeaux</span>
                  </div>
                </button>
              </div>
              
              {/* Site Bordeaux */}
              <div>
                <button 
                  className={`w-full p-4 text-left flex justify-between items-center ${selectedSite === 'bordeaux' ? 'bg-blue-50' : ''}`}
                  onClick={() => handleSiteClick('bordeaux')}
                >
                  <div className="flex items-center">
                    <span className={`font-semibold ${selectedSite === 'bordeaux' ? 'text-blue-900' : ''}`}>Site Bordeaux</span>
                    <span className="text-gray-500 ml-2">Bat. BDX</span>
                  </div>
                  {openSections.bordeaux ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {openSections.bordeaux && (
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold">Adresse</h3>
                      <p className="flex items-start">
                        <MapPin size={18} className="mr-2 mt-1 text-blue-900 flex-shrink-0" />
                        <span>83 rue Lucien Faure,<br />33000 Bordeaux</span>
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">Horaires</h3>
                      <p className="flex items-start">
                        <Clock size={18} className="mr-2 mt-1 text-blue-900 flex-shrink-0" />
                        <span>Lundi au vendredi : 7h30 à 21h</span>
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">Contact de l'accueil</h3>
                      <p className="flex items-center">
                        <Mail size={18} className="mr-2 text-blue-900 flex-shrink-0" />
                        <span>accueil-bordeaux@efrei.fr</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}