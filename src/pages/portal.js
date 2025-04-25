import React, { useState } from "react";
import Navbar from "../components/Navbar";
import NavbarMenus from "../components/NavbarMenus";
import { ChevronRight, ChevronLeft, X, Clock, MapPin, ArrowLeft } from "lucide-react";

export default function MyEfreiPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("YOUTUBE");
  const [activeNewsFilter, setActiveNewsFilter] = useState("À LA UNE");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  
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
  
  const filteredNews = allNews.filter(item => item.category === activeNewsFilter);
  
  const newsToDisplay = filteredNews.length > 0 ? filteredNews : [];
  
  const upcomingEvents = [
    {
      id: 1,
      date: "29",
      month: "Avr",
      title: "CHOUETTES AWARDS",
      description: "LE PITCH - 60 étudiant(e)s",
      time: "13:30 - 17:30",
      fullDate: "Mardi 29 avr. 2025",
      location: "amphi-C001",
      details: [
        "LE PITCH :",
        "- 60 étudiant(e)s",
        "- 12 enseignant(e)s",
        "- Des travaux collaboratifs pendant 7 mois",
        "- 10 films en compétition",
        "- 10 juré(e)s exceptionnel(le)s pour une sélection du podium et du « Grand Prix »",
        "- 1 vote proposé aux 5 600 étudiant(e)s pour la s"
      ]
    },
    {
      id: 2,
      date: "1",
      month: "Mai",
      title: "HACKATHON IA",
      description: "Développement d'applications IA - 120 places",
      time: "9:00 - 22:00",
      fullDate: "Mercredi 1 mai 2025",
      location: "Lab Innovation",
      details: [
        "CHALLENGE TECH :",
        "- 120 participants",
        "- 16 heures de développement non-stop",
        "- 5 défis proposés par nos partenaires",
        "- Prix à gagner : stages, formations et matériel tech"
      ]
    },
    {
      id: 3,
      date: "4",
      month: "Mai",
      title: "FORUM ENTREPRISES",
      description: "35 entreprises - Opportunités de stage",
      time: "10:00 - 17:00",
      fullDate: "Samedi 4 mai 2025",
      location: "Hall Principal",
      details: [
        "RENCONTREZ VOTRE FUTUR EMPLOYEUR :",
        "- 35 entreprises présentes",
        "- Ateliers CV et entretiens",
        "- Conférences métiers",
        "- Sessions de recrutement express"
      ]
    },
    {
      id: 4,
      date: "17",
      month: "Mai",
      title: "CONFÉRENCE CYBERSÉCURITÉ",
      description: "Intervenant: CTO de Microsoft France",
      time: "18:30 - 20:30",
      fullDate: "Vendredi 17 mai 2025",
      location: "Auditorium",
      details: [
        "SÉCURITÉ & INNOVATION :",
        "- Présentation par le CTO de Microsoft France",
        "- Table ronde avec experts du secteur",
        "- Démonstration de nouvelles technologies",
        "- Cocktail networking après la conférence"
      ]
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />
      <NavbarMenus />
      
      <div className="relative max-w-6xl mx-auto px-4 mt-6">
        <div className="relative overflow-hidden rounded-lg bg-white shadow-md">
          {events.map((event, index) => (
            activeSlide === index && (
              <img 
                key={event.id}
                src={event.image} 
                alt={event.title} 
                className="w-full object-contain"
                style={{ maxHeight: "400px" }}
              />
            )
          ))}
          
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
        
          <div className="flex justify-center gap-2 mt-4 mb-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <button 
                key={index} 
                className={`h-2 w-2 rounded-full ${activeSlide === index ? 'bg-blue-900' : 'bg-gray-300'}`}
                onClick={() => setActiveSlide(index % events.length)}
              />
            ))}
          </div>
        </div>
      
      <div className="max-w-6xl mx-auto px-4 mt-10 flex flex-col lg:flex-row gap-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex-1">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-900">Actualités</h2>
            </div>
            
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsToDisplay.length > 0 ? (
                newsToDisplay.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedNews(item)}
                  >
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
                <div className="col-span-2"></div>
              )}
            </div>
          </section>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 lg:w-72">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Événements</h2>
          {upcomingEvents.map(event => (
            <div 
              key={event.id} 
              className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedEvent(event)}
            >
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
      
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative">
            <button 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedEvent(null)}
            >
              <X size={24} />
            </button>
            
            <div className="p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-1">
                {selectedEvent.title}
              </h3>
              <h4 className="font-semibold mb-4">GRAND JURY</h4>
              
              <div className="flex items-center gap-2 mb-3">
                <Clock size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm">{selectedEvent.fullDate}</p>
                  <p className="text-sm">{selectedEvent.time}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-5">
                <MapPin size={20} className="text-gray-500" />
                <p className="text-sm">{selectedEvent.location}</p>
              </div>
              
              {selectedEvent.details && (
                <div className="border-t pt-4">
                  {selectedEvent.details.map((detail, idx) => (
                    <p key={idx} className="text-sm mb-1">{detail}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {selectedNews && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <button 
              className="flex items-center text-blue-900 mb-6 hover:underline"
              onClick={() => setSelectedNews(null)}
            >
              <ArrowLeft size={18} className="mr-1" />
              RETOUR
            </button>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <p className="text-sm text-gray-500">Publié le {selectedNews.date}</p>
            </div>
            
            <h1 className="text-3xl font-bold text-blue-900 mb-6">{selectedNews.title}</h1>
            
            <p className="text-lg mb-6">{selectedNews.description}</p>
            
            <div className="mb-10">
              <img 
                src={selectedNews.image} 
                alt={selectedNews.title} 
                className="w-full h-auto object-cover rounded-md mb-4"
              />
            </div>

            {selectedNews.id === 1 && (
              <div className="prose max-w-none">
                <p className="mb-4">Dans le cadre de leur projet fil rouge, nos étudiants en B1MDC des campus de Paris et Bordeaux ont réalisé 10 courts métrages sur le thème de la vie étudiante à l'Efrei.</p>
                
                <p className="mb-4">De la comédie audacieuse au thriller haletant, préparez-vous à être surpris par leur créativité !</p>
                
                <p className="mb-4">Ce projet est l'aboutissement d'un processus créatif complet pour nos étudiants, de l'idéation à la diffusion, leur permettant de développer des compétences essentielles en communication, marketing digital et gestion de projet, tout en créant une œuvre personnelle et collaborative.</p>
                
                <p className="mb-4">Les étudiants présenteront leurs films devant un grand jury de professionnels de l'audiovisuel et de la communication le 29 avril à partir de 13h sur le campus parisien. (Amphi COO1)</p>
                
                <p className="mb-4">Plusieurs prix y seront décernés :</p>
                <ul className="list-disc pl-5 mb-4">
                  <li>Le Grand Prix du jury</li>
                  <li>Le Prix Spécial staff</li>
                  <li>Le Prix Spécial étudiant(e)s</li>
                  <li>Le prix spécial collègien(ne)s</li>
                </ul>
                
                <p className="mb-4">Vous serez les bienvenus en tant qu'observateur et public pour 60 étudiant(e)s de 10 groupes soutenant à l'oral leur projet avec 10 films en compétition.</p>
                
                <p className="mb-8">Alors, à vos écrans et que le meilleur film gagne !</p>
              </div>
            )}
            
            {selectedNews.id === 2 && (
              <div className="prose max-w-none">
                <p className="mb-4">My Very Good Trip – Le podcast pour bien choisir sa mobilité internationale !</p>
                
                <p className="mb-4">Vous allez étudier à l'étranger et vous ne savez pas quelle destination choisir ? Découvrez My Very Good Trip, le podcast de la mobilité internationale pour vous guider dans votre choix.</p>
                
                <p className="mb-4">Partez à la rencontre de nos étudiants et explorez leurs expériences aux quatre coins du monde. Découvrez leurs récits, leurs conseils et leurs astuces pour réussir votre mobilité internationale.</p>
                
                <p className="mb-4">✈️ <strong>La mobilité à l'Efrei : une expérience académique et culturelle</strong></p>
                
                <p className="mb-4">L'Efrei offre aux étudiants une passerelle vers le monde à grâce à ses nombreux partenariats avec des établissements et universités situés aux quatre coins du monde.</p>
                
                <p className="mb-4">📍<strong>Parmi les ressources proposées à l'international :</strong></p>
                
                <ul className="list-disc pl-5 mb-4">
                  <li>93 universités partenaires réparties dans 40 pays</li>
                  <li>Des expériences académiques et professionnelles uniques</li>
                  <li>Une immersion dans des environnements multiculturels pour enrichir ses connaissances</li>
                  <li>Le développement de compétences clés recherchées par les entreprises</li>
                </ul>
                
                <p className="mb-4">🌍 Pour plus d'informations, rendez-vous sur le site internet : <a href="https://www.efrei.fr/etudier-a-linternational/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.efrei.fr/etudier-a-linternational/</a></p>
                
                <p className="mb-4">Vous pouvez retrouver tous les épisodes sur Spotify : <a href="https://open.spotify.com/show/25dUpx4D135iziFuhNKXRw" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://open.spotify.com/show/25dUpx4D135iziFuhNKXRw</a></p>
              </div>
            )}
            
            {selectedNews.id === 4 && (
              <div className="prose max-w-none">
                <p className="mb-4">Bonne nouvelle : toutes les informations pour bien préparer votre rentrée 2024 à l'Efrei sont disponibles sur le site efrei.fr.</p>
                
                <p className="mb-4">Toutes les informations pratiques de votre rentrée et votre emploi du temps vous sont également envoyées par mail dès que votre inscription est finalisée.</p>
                
                <p className="mb-4">L'équipe Student Services est à votre disposition si vous avez besoin de plus d'informations :</p>
                
                <ul className="list-disc pl-5 mb-4">
                  <li>scolarite@efrei.fr (Programme Ingénieurs)</li>
                  <li>scolarite-pex@efrei.fr (BTS, Bachelor, Mastère..)</li>
                </ul>
              </div>
            )}
            
            {selectedNews.id === 5 && (
              <div className="prose max-w-none">
                <p className="mb-4">L'informatique quantique et ses enjeux : opportunités et risques</p>
                
                <p className="mb-4">Les prévisions de Gartner indiquent que les premières applications des ordinateurs quantiques pourraient émerger d'ici 2027, avec des implications majeures pour des secteurs stratégiques tels que la logistique et les transactions financières. Cette échéance soulève déjà des questions cruciales concernant la crédibilité de cette prédiction, l'état actuel de la technologie, les risques associés et les mesures à adopter pour s'y préparer.</p>
                
                <h3 className="font-bold text-xl mt-6 mb-3">Une prédiction crédible ?</h3>
                
                <p className="mb-4">La prédiction de Gartner repose sur une observation des progrès rapides et soutenus dans la recherche et le développement en informatique quantique. De grands acteurs technologiques comme IBM, Google, Microsoft, ainsi que des start-ups prometteuses comme Rigetti et IonQ, ont intensifié leurs investissements au cours des dernières années. En parallèle, des gouvernements, notamment ceux des États-Unis, de la Chine et de l'Union européenne, ont lancé des initiatives ambitieuses pour accélérer l'innovation dans ce domaine stratégique.</p>
                
                <p className="mb-4">Cependant, l'informatique quantique en est encore à une phase préliminaire de son évolution. Les machines actuelles, appelées « NISQ » (Noisy Intermediate-Scale Quantum), sont capables de démonstrations techniques impressionnantes mais restent loin de résoudre des problèmes industriels à grande échelle. Les principaux défis incluent :</p>
                
                <ul className="list-disc pl-5 mb-4">
                  <li>La décohérence : Les qubits perdent rapidement leur état quantique, limitant la durée des calculs.</li>
                  <li>Les erreurs de calcul : Les systèmes quantiques nécessitent des algorithmes de correction d'erreurs pour garantir des résultats fiables.</li>
                  <li>Les conditions physiques extrêmes : Les qubits doivent être maintenus à des températures proches du zéro absolu pour fonctionner correctement.</li>
                </ul>
              </div>
            )}
            
            {selectedNews.id === 6 && (
              <div className="prose max-w-none">
                <p className="mb-4">L'Efrei organise chaque année un séminaire pour aider ses élèves-ingénieurs en ING1 (première année du cycle ingénieur) à choisir une spécialisation parmi les 14 majeures proposées.</p>
                
                <p className="mb-4">Après trois années d'études, les élèves-ingénieurs de l'Efrei doivent choisir la majeure de spécialisation qu'ils suivront en ING2. Pour les accompagner dans cette étape décisive, l'Efrei organise chaque année un séminaire d'orientation. Le 14 janvier dernier, à la Cité internationale universitaire de Paris, près de 450 élèves-ingénieurs ont ainsi pu explorer leurs options, découvrir les débouchés et réfléchir à la notion de choix, composante essentielle de leur avenir professionnel.</p>
                
                <h3 className="font-bold text-xl mt-6 mb-3">Les temps forts de la journée</h3>
                
                <p className="mb-4">Cette journée a été marquée plusieurs temps forts, pensés pour aider les étudiants :</p>
                
                <ul className="list-disc pl-5 mb-4">
                  <li>Une présentation des majeures de spécialisation, avec un panorama complet des 14 parcours proposés, couvrant des domaines comme l'intelligence artificielle, la cybersécurité, les systèmes embarqués ou encore la data science.</li>
                  <li>Une introduction par Frédéric Meunier, directeur général de l'Efrei, qui a souligné l'importance de faire un choix aligné avec ses passions et objectifs professionnels.</li>
                  <li>Un discours proposé par René Bancarel, directeur des études PGE, et Ziad Adem, directeur des études cycle L.</li>
                  <li>Un discours d'inspiration par le parrain de la promotion, Marc Sannier, Leader Technique de Projets chez IBM</li>
                  <li>La conférence « Comment faire un choix ?», proposée par Fabien Olicard, mentaliste, humoriste et vidéaste. Ce dernier a captivé notre audience en partageant des outils concrets pour prendre des décisions éclairées et efficaces.</li>
                </ul>
              </div>
            )}
            
            {/* Si aucun ID spécifique ne correspond, nous affichons un contenu par défaut */}
            {![1, 2, 4, 5, 6].includes(selectedNews.id) && (
              <div className="prose max-w-none">
                <p>
                  Dans le cadre de leur projet fil rouge, nos étudiants en B1MDC des campus de Paris et Bordeaux ont réalisé 10 courts métrages sur le thème de la vie étudiante à l'Efrei.
                </p>
                <p>
                  De la comédie audacieuse au thriller haletant, préparez-vous à être surpris par leur créativité ! 
                </p>
                <p>
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {selectedNews.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-gray-100 px-3 py-1.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
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
          
          {activeTab === 'YOUTUBE' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="space-y-4">
              <a href="https://www.instagram.com/p/DDJ6wTrCZz6/?img_index=1" target="_blank" rel="noopener noreferrer" className="block">
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-2">04 décembre 2024</p>
                  <p className="text-sm">
                    Rencontrez Morgane, Présidente d'Art'Efrei et Vice-Présidente du Bureau des Arts ! 💕 ✨ Élève ingénieure en LSI et alternante, Morgane explore toutes les formes d'expression artistique : théâtre, danse, origami... elle laisse libre cours à sa créativité et encourage les étudiants et étudiantes à faire de même. ✌️ Le BDA est le bureau qui coordonne les nombreuses associations artistiques de l'Efrei. Fête de la Musique, Spectacle de Fin d'Année... autant d'événements organisés qui rythment la vie étudiante. #Efrei #vieassociative #vieetudiante #art #ecoleingenieur #associationetudiante
                  </p>
                </div>
              </a>

              <a href="https://www.instagram.com/p/DDEpXGXsbgj/?img_index=1" target="_blank" rel="noopener noreferrer" className="block">
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-2">02 décembre 2024</p>
                  <p className="text-sm">
                    📅 En décembre à l'Efrei 👀 #Calendar #Events #SaveTheDate
                  </p>
                </div>
              </a>

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