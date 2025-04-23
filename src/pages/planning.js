import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'react-feather';
import Navbar from '../components/Navbar';
import NavbarMenus from '../components/NavbarMenus';

export default function PlanningPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emploiDuTemps, setEmploiDuTemps] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const navigate = useNavigate();
  const { auth } = useAuth();
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i));
  
  const hours = Array.from({ length: 14 }, (_, i) => i + 7);
  
  useEffect(() => {
    const fetchEmploiDuTemps = async () => {
      try {
        setLoading(true);
        
        if (!auth || !auth.user) {
          navigate('/login');
          return;
        }
        
        let apiRoute;
        if (auth.role === 'eleve') {
          apiRoute = `${process.env.REACT_APP_BACKEND_URL}/eleve/eleves/${auth.user.id}`;
        } else if (auth.role === 'prof') {
          apiRoute = `${process.env.REACT_APP_BACKEND_URL}/prof/professeurs/${auth.user.id}`;
        } else {
          throw new Error("Rôle non supporté");
        }
    
        const response = await fetch(apiRoute);
        
        if (!response.ok) {
          throw new Error("Impossible de récupérer l'emploi du temps");
        }
        
        const data = await response.json();
        
        // Traitement uniforme pour élèves et professeurs car les deux APIs renvoient maintenant data.emploiDuTemps
        if (data.emploiDuTemps) {
          setEmploiDuTemps(data.emploiDuTemps);
        } else {
          throw new Error("Format de données incorrect");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'emploi du temps:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchEmploiDuTemps();
  }, [navigate, auth]);
  
  const previousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  const formatWeekPeriod = () => {
    return format(currentDate, "MMMM yyyy, 'Sem.' w", { locale: fr });
  };
  
  const getSessionsForDay = (day) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    return emploiDuTemps[dateKey] || [];
  };
  
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };
  
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Navbar />
        <NavbarMenus />
        <div className="p-8 flex justify-center items-center">
          <p className="text-lg">Chargement de l'emploi du temps...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Navbar />
        <NavbarMenus />
        <div className="p-8 flex flex-col items-center">
          <p className="text-lg text-red-600 mb-4">Erreur: {error}</p>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />
      <NavbarMenus />
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#0a2463]">Planning</h1>
        
        <div className="flex justify-between items-center mb-4">
            <button onClick={previousWeek} className="p-2">
            <ChevronLeft size={24} />
            </button>
            <h2 className="text-lg font-medium">{formatWeekPeriod()}</h2>
            <button onClick={nextWeek} className="p-2">
            <ChevronRight size={24} />
            </button>
        </div>
        
        

        <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
            <div className="min-w-full grid grid-cols-[4rem_repeat(6,1fr)]">
                <div className="sticky top-0 z-10 bg-white">
                <div className="h-12 border-b"></div>
                </div>
                {weekDays.map((day) => (
                <div key={day.toString()} className="sticky top-0 z-10 bg-white border-l">
                    <div className="h-12 flex flex-col justify-center items-center p-1 border-b bg-gray-50">
                    <div className="font-medium text-gray-800 text-xs">
                        {format(day, 'EEEE', { locale: fr }).charAt(0).toUpperCase() + format(day, 'EEEE', { locale: fr }).slice(1)}
                    </div>
                    <div className="text-sm font-bold text-blue-800">{format(day, 'dd')}</div>
                    </div>
                </div>
                ))}

                <div>
                {hours.map((hour) => (
                    <div key={hour} className="h-16 border-t flex items-start justify-end pr-2 pt-1">
                    <span className="text-xs font-medium text-gray-500">{hour}:00</span>
                    </div>
                ))}
                </div>

                {weekDays.map((day) => (
                <div key={day.toString()} className="border-l relative">
                    {hours.map((hour) => (
                    <div key={hour} className="h-16 border-t"></div>
                    ))}
                    
                    {getSessionsForDay(day).map((session, idx) => {
                    const startHour = parseInt(session.start_time.split(':')[0]);
                    const startMinute = parseInt(session.start_time.split(':')[1]);
                    const endHour = parseInt(session.end_time.split(':')[0]);
                    const endMinute = parseInt(session.end_time.split(':')[1]);
                    
                    const top = (startHour - 7) * 64 + (startMinute / 60) * 64;
                    const height = ((endHour - startHour) + (endMinute - startMinute) / 60) * 64;
                    
                    let bgColor, textColor, borderColor;
                    if (session.matiere.name.includes('EXAMEN')) {
                        bgColor = 'bg-pink-100';
                        textColor = 'text-pink-900';
                        borderColor = 'border-pink-300';
                    } else {
                        bgColor = 'bg-blue-50';
                        textColor = 'text-blue-900';
                        borderColor = 'border-blue-200';
                    }
                    
                    return (
                        <div
                        key={`${session.id}-${idx}`}
                        className={`absolute inset-x-1 rounded-lg shadow-sm ${bgColor} ${borderColor} border p-1.5 overflow-hidden`}
                        style={{ 
                            top: `${top}px`, 
                            height: `${height}px`,
                            transition: 'all 0.2s ease'
                        }}
                        >
                        <div className="h-full flex flex-col">
                            <div className={`font-bold ${textColor} text-xs truncate`}>
                            {session.matiere.name}
                            </div>
                            <div className="text-xs text-gray-600 font-medium">
                            {formatTime(session.start_time)} - {formatTime(session.end_time)}
                            </div>
                            
                            {auth.role === 'eleve' && session.professeur && (
                                <div className="text-xs text-gray-700 mt-0.5 italic truncate">
                                    {`${session.professeur.firstname} ${session.professeur.name}`}
                                </div>
                            )}
                            
                            {auth.role === 'prof' && session.classe && (
                                <div className="text-xs text-gray-700 mt-0.5 italic truncate">
                                    {session.classe.name}
                                </div>
                            )}
                            
                            {session.salle && (
                                <div className="mt-auto text-xs bg-white bg-opacity-50 rounded px-1 py-0.5 font-medium text-gray-700 inline-flex self-start">
                                    Salle {session.salle}
                                </div>
                            )}
                        </div>
                        </div>
                    );
                    })}
                </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}