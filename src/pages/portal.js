import React, { useState } from "react";
import Navbar from "../components/Navbar";
import NavbarMenus from "../components/NavbarMenus";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function MyEfreiPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("YOUTUBE");
  const [activeNewsFilter, setActiveNewsFilter] = useState("À LA UNE");
  
  // Utilisé pour afficher le carousel
  const events = [
    {
      id: 1,
      image: "/images/jardin-club.jpg",
      title: "JARDIN CLUB",
      subtitle: "OPEN-AIR CLUB",
      location: "CHALET DU LAC",
      date: "VEN. 25 AVRIL",
      time: "21H-05H"
    },
    {
      id: 2,
      image: "/images/assos-carrousel.jpg",
      title: "JARDIN CLUB",
      subtitle: "OPEN-AIR CLUB",
      location: "CHALET DU LAC",
      date: "VEN. 25 AVRIL",
      time: "21H-05H"
    },
    {
      id: 3,
      image: "/images/tandem-carrousel.jpg",
      title: "JARDIN CLUB",
      subtitle: "OPEN-AIR CLUB",
      location: "CHALET DU LAC",
      date: "VEN. 25 AVRIL",
      time: "21H-05H"
    },
    {
      id: 4,
      image: "/images/USA-carrousel.jpg",
      title: "JARDIN CLUB",
      subtitle: "OPEN-AIR CLUB",
      location: "CHALET DU LAC",
      date: "VEN. 25 AVRIL",
      time: "21H-05H"
    },
    {
      id: 5,
      image: "/images/tir-carrousel.jpg",
      title: "JARDIN CLUB",
      subtitle: "OPEN-AIR CLUB",
      location: "CHALET DU LAC",
      date: "VEN. 25 AVRIL",
      time: "21H-05H"
    }
  ];
  
  // Données simulées pour les actualités avec catégories
  const allNews = [
    {
      id: 1,
      date: "21 AVR. 2025",
      title: "Les Chouettes Awards 2025 sont lancées !",
      description: "Votez pour votre court métrage préféré !",
      image: "/images/chouettes-awards.jpg",
      tags: ["VIE DE L'ÉCOLE", "IPCS", "DIGITAL & MANAGEMENT"],
      category: "À LA UNE"
    },
    {
      id: 2,
      date: "16 AVR. 2025",
      title: "My Very Good Trip - Le podcast pour bien choisir sa mobilité...",
      description: "Vous allez étudier à l'étranger et vous ne savez pas quelle destination choisir ? Découvrez My Very Good Trip, le podcast...",
      image: "/images/my-very-good-trip.jpg", 
      tags: ["MOBILITÉS INTERNATIONALES"],
      category: "À LA UNE"
    },
    {
      id: 3,
      date: "21 AVR. 2025",
      title: "Les Chouettes Awards 2025 sont lancées !",
      description: "Votez pour votre court métrage préféré !",
      image: "/images/chouettes-awards.jpg",
      tags: ["VIE DE L'ÉCOLE", "PEX", "DIGITAL & MANAGEMENT"],
      category: "DIGITAL & MANAGEMENT"
    },
    {
      id: 4,
      date: "29 JUIL. 2024",
      title: "Information rentrée 2024",
      description: "Dates de rentrées, plannings, ressources ... les informations pour bien préparer votre rentrée sont disponibles.",
      image: "/images/rentree-2024.jpg",
      tags: ["ÉCOLE", "DIRECTION"],
      category: "DIRECTION GÉNÉRALE"
    },
    {
      id: 5,
      date: "4 MARS. 2025",
      title: "Newsletter 2024-2025 - Pôle SRSE",
      description: "Découvrez la nouvelle newsletter du pôle SRSE !",
      image: "/images/SRSE.jpg",
      tags: ["PÉDAGOGIE", "FORMATION"],
      category: "DIRECTION DE LA FORMATION"
    },
    {
      id: 6,
      date: "22 JANV. 2025",
      title: "Séminaire d'orientation ING1",
      description: "L'Efrei organise chaque année un séminaire pour aider ses élèves-ingénieurs en ING1 (première année du cycle ingénieur) à choisir une spécialisation parmi les 14 majeures proposées.",
      image: "/images/seminaire.jpg",
      tags: ["VIE DE L'ECOLE", "FORMATION"],
      category: "DIRECTION DE LA FORMATION"
    }
  ];
  
  // Filtrer les actualités en fonction du filtre actif
  const filteredNews = allNews.filter(item => item.category === activeNewsFilter);
  
  // Si aucune actualité ne correspond au filtre, afficher un placeholder
  const newsToDisplay = filteredNews.length > 0 ? filteredNews : [];
  
  // Données pour les événements
  const upcomingEvents = [
    {
      id: 1,
      date: "29",
      month: "Avr",
      title: "CHOUETTES AWARDS",
      description: "LE PITCH - 60 étudiant(e)s",
      time: "13:30 - 17:30"
    },
    {
      id: 2,
      date: "1",
      month: "Mai",
      title: "HACKATHON IA",
      description: "Développement d'applications IA - 120 places",
      time: "9:00 - 22:00"
    },
    {
      id: 3,
      date: "4",
      month: "Mai",
      title: "FORUM ENTREPRISES",
      description: "35 entreprises - Opportunités de stage",
      time: "10:00 - 17:00"
    },
    {
      id: 4,
      date: "17",
      month: "Mai",
      title: "CONFÉRENCE CYBERSÉCURITÉ",
      description: "Intervenant: CTO de Microsoft France",
      time: "18:30 - 20:30"
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />
      <NavbarMenus />
      
      {/* Carousel - avec effet de box */}
      <div className="relative max-w-6xl mx-auto px-4 mt-6">
        <div className="relative overflow-hidden rounded-lg bg-white shadow-md">
          {events.map((event, index) => (
            activeSlide === index && (
              <img 
                key={event.id}
                src={event.image} 
                alt={event.title} 
                className="w-full object-contain" // Remplacé h-64 par object-contain
                style={{ maxHeight: "400px" }}    // Ajout d'une hauteur maximale
              />
            )
          ))}
          
          {/* Navigation buttons */}
          <button 
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 p-2 rounded-full"
            onClick={() => setActiveSlide((prev) => (prev === 0 ? events.length - 1 : prev - 1))}
          >
            <ChevronLeft size={24} color="white" />
          </button>
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 p-2 rounded-full"
            onClick={() => setActiveSlide((prev) => (prev === events.length - 1 ? 0 : prev + 1))}
          >
            <ChevronRight size={24} color="white" />
          </button>
        </div>
        
        {/* Pagination dots - Affiche 9 points fixes */}
          <div className="flex justify-center gap-2 mt-4 mb-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <button 
                key={index} 
                className={`h-2 w-2 rounded-full ${activeSlide === index ? 'bg-blue-900' : 'bg-gray-300'}`}
                onClick={() => setActiveSlide(index % events.length)} // Pour éviter les erreurs si on clique sur un point sans slide correspondant
              />
            ))}
          </div>
        </div>
      
      {/* Main content with Actualités and Événements side by side */}
      <div className="max-w-6xl mx-auto px-4 mt-10 flex flex-col lg:flex-row gap-8">
        {/* Actualités Section - avec effet de box */}
        <div className="bg-white rounded-lg shadow-md p-6 flex-1">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-900">Actualités</h2>
            </div>
            
            {/* Tags filtrants */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              <button 
                className={`px-4 py-1 text-xs rounded whitespace-nowrap ${activeNewsFilter === 'À LA UNE' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => setActiveNewsFilter('À LA UNE')}
              >
                À LA UNE
              </button>
              <button 
                className={`px-4 py-1 text-xs rounded whitespace-nowrap ${activeNewsFilter === 'DIGITAL & MANAGEMENT' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => setActiveNewsFilter('DIGITAL & MANAGEMENT')}
              >
                DIGITAL & MANAGEMENT
              </button>
              <button 
                className={`px-4 py-1 text-xs rounded whitespace-nowrap ${activeNewsFilter === 'DIRECTION GÉNÉRALE' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => setActiveNewsFilter('DIRECTION GÉNÉRALE')}
              >
                DIRECTION GÉNÉRALE
              </button>
              <button 
                className={`px-4 py-1 text-xs rounded whitespace-nowrap ${activeNewsFilter === 'DIRECTION DE LA FORMATION' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => setActiveNewsFilter('DIRECTION DE LA FORMATION')}
              >
                DIRECTION DE LA FORMATION
              </button>
            </div>
            
            {/* News grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsToDisplay.length > 0 ? (
                newsToDisplay.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <p className="text-sm text-gray-500">{item.date}</p>
                      <h3 className="font-semibold mt-1 text-blue-900">{item.title}</h3>
                      <p className="text-sm mt-2 text-gray-600">{item.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Placeholder quand il n'y a pas d'actualités pour cette catégorie
                <div className="col-span-2 py-10 flex flex-col items-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <p className="mt-2">Des nouvelles actualités arriveront prochainement</p>
                </div>
              )}
            </div>
          </section>
        </div>
        
        {/* Événements Section - avec effet de box */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:w-72">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Événements</h2>
          {upcomingEvents.map(event => (
            <div key={event.id} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
              <div className="flex gap-4 items-center">
                <div className="bg-blue-900 text-white rounded p-2 text-center">
                  <span className="block">{event.date}</span>
                  <span className="block text-xs">{event.month}</span>
                </div>
                <div>
                  <p className="font-semibold text-xs">{event.title}</p>
                  <p className="text-xs text-gray-600">{event.description}</p>
                  <p className="text-xs text-gray-600">{event.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Social media section - avec effet de box */}
      <div className="max-w-6xl mx-auto px-4 mt-10 mb-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Sur les réseaux</h2>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button 
              className={`px-4 py-1 text-xs rounded ${activeTab === 'YOUTUBE' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setActiveTab('YOUTUBE')}
            >
              YOUTUBE
            </button>
            <button 
              className={`px-4 py-1 text-xs rounded ${activeTab === 'INSTAGRAM' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setActiveTab('INSTAGRAM')}
            >
              INSTAGRAM
            </button>
          </div>
          
          {/* Social media content */}
          {activeTab === 'YOUTUBE' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Première vidéo - My Very Good Trip */}
              <a href="https://www.youtube.com/watch?v=UxnY6K-hVuQ&ab_channel=Efrei" target="_blank" rel="noopener noreferrer" className="block">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 h-full">
                  <div className="relative">
                    <img 
                      src="/images/my-very-good-trip.jpg" 
                      alt="Podcast Mobilité Internationale aux États-Unis" 
                      className="w-full object-cover" 
                      style={{ height: "180px" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="video-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium" style={{ fill: 'white', width: '48px', height: '48px' }}>
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm">Podcast Mobilité Internationale aux États-Unis !</h3>
                    <p className="text-xs text-gray-600 mt-1">Épisode #02 Saison 2 | My Very Good Trip 16 avril 2025</p>
                  </div>
                </div>
              </a>
              
              {/* Deuxième vidéo - Bourse Program'her */}
              <a href="https://www.youtube.com/watch?v=6IqchSnl4HE&ab_channel=Efrei" target="_blank" rel="noopener noreferrer" className="block">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 h-full">
                  <div className="relative">
                    <img 
                      src="/images/temoignage-mecene.jpg" 
                      alt="Témoignage du mécène" 
                      className="w-full object-cover" 
                      style={{ height: "180px" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="video-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium" style={{ fill: 'white', width: '48px', height: '48px' }}>
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm">Bourse Program'her - Témoignage du mécène</h3>
                    <p className="text-xs text-gray-600 mt-1">ekino | Efrei 02 avril 2025</p>
                  </div>
                </div>
              </a>
            </div>
          ) : (
            // Instagram Content
            <div className="space-y-4">
              {/* Premier post Instagram */}
              <a href="https://www.instagram.com/p/DDJ6wTrCZz6/?img_index=1" target="_blank" rel="noopener noreferrer" className="block">
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-2">04 décembre 2024</p>
                  <p className="text-sm">
                    Rencontrez Morgane, Présidente d'Art'Efrei et Vice-Présidente du Bureau des Arts ! 💕 ✨ Élève ingénieure en LSI et alternante, Morgane explore toutes les formes d'expression artistique : théâtre, danse, origami... elle laisse libre cours à sa créativité et encourage les étudiants et étudiantes à faire de même. ✌️ Le BDA est le bureau qui coordonne les nombreuses associations artistiques de l'Efrei. Fête de la Musique, Spectacle de Fin d'Année... autant d'événements organisés qui rythment la vie étudiante. #Efrei #vieassociative #vieetudiante #art #ecoleingenieur #associationetudiante
                  </p>
                </div>
              </a>

              {/* Deuxième post Instagram */}
              <a href="https://www.instagram.com/p/DDEpXGXsbgj/?img_index=1" target="_blank" rel="noopener noreferrer" className="block">
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-2">02 décembre 2024</p>
                  <p className="text-sm">
                    📅 En décembre à l'Efrei 👀 #Calendar #Events #SaveTheDate
                  </p>
                </div>
              </a>

              {/* Troisième post Instagram */}
              <a href="https://www.instagram.com/reel/DC8yotjIGZe/" target="_blank" rel="noopener noreferrer" className="block">
                <div className="pb-4">
                  <p className="text-sm text-gray-600 mb-2">29 novembre 2024</p>
                  <p className="text-sm">
                    No time to flag 🏴 Retour sur l'édition 2024 de la Overnight, l'événement dédié à la cyber de l'Efrei ! Revivez cette sixième édition qui a vu plus de 400 #étudiants participer à des stands, des ateliers, des #conférences et l'incontournable #CTF qui a duré #allnightlong sur nos campus parisiens et bordelais. @ctfrei_ @club.rezo @one_pantheon
                  </p>
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}