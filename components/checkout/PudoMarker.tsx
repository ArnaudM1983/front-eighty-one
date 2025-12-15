"use client";
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
// Assurez-vous d'importer PUDOInfo et PUDOHoursByDay
import { PUDOInfo, PUDOHoursByDay } from './MondialRelayHandler'; 

// --- DÉFINITIONS ET FONCTIONS UTILITAIRES POUR LES HORAIRES (inchangées) ---

// Si PUDOHours n'est pas exporté, on le déduit
type PUDOHours = PUDOInfo extends { hours: infer T } ? T[keyof T] : any; 

const formatTime = (time: string | undefined): string => {
  if (!time) return '';
  const hours = time.substring(0, 2);
  const minutes = time.substring(2, 4);
  return `${hours}h${minutes}`;
};

const formatDaySchedule = (hours: PUDOHours | undefined): string => {
  if (!hours) return 'Non spécifié';

  const amStart = formatTime(hours.am_start);
  const amEnd = formatTime(hours.am_end);
  const pmStart = formatTime(hours.pm_start);
  const pmEnd = formatTime(hours.pm_end);

  if (!amStart && !pmStart) {
    return 'Fermé';
  }
  
  // Cas simple (une seule ouverture/fermeture ou ouverture continue)
  if (!pmStart || pmStart === amEnd) { 
    return `${amStart} - ${amEnd}`;
  }

  // Cas avec coupure (Matin et Après-midi)
  let schedule = `${amStart} - ${amEnd}`;
  if (pmStart && pmEnd) {
      schedule += ` & ${pmStart} - ${pmEnd}`;
  }
  return schedule;
};

// --- FIN DES FONCTIONS UTILITAIRES ---


// Définition de l'icône Leaflet par défaut
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface PudoMarkerProps {
  pudo: PUDOInfo;
  onPudoSelect: (pudo: PUDOInfo) => void;
  isSelected: boolean;
}

const PudoMarker: React.FC<PudoMarkerProps> = ({ pudo, onPudoSelect, isSelected }) => {
  if (!pudo || typeof pudo.latitude !== 'number' || typeof pudo.longitude !== 'number') {
    return null;
  }

  const iconToUse = customIcon; 

  // Déclaration du tableau des jours pour la boucle
  const dayNames: (keyof PUDOHoursByDay)[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  
  // Obtenir le jour actuel en français pour le mettre en surbrillance
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' }); 
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1) as keyof PUDOHoursByDay;


  return (
    <Marker 
        position={[pudo.latitude, pudo.longitude]} 
        icon={iconToUse}
    >
      <Popup maxHeight={300}>
        <div className="text-sm">
          <p className="font-bold text-base">{pudo.name}</p>
          <p>{pudo.address}</p>
          <p className="mb-2 text-gray-600">{pudo.postalCode} {pudo.city}</p>

          {/* Section Horaires : Vérification conditionnelle de pudo.hours */}
          {pudo.hours && (
            <div className="border-t pt-2">
              <p className="font-semibold text-sm mb-1">Horaires d'ouverture :</p>
              
              {dayNames.map(day => (
                <p 
                  key={day} 
                  className={`text-xs ${day === todayCapitalized ? 'font-bold text-blue-700' : ''}`}
                >
                  {/* Utilisation de ! pour affirmer à TypeScript que pudo.hours existe ici */}
                  {day} : {formatDaySchedule(pudo.hours![day])}
                </p>
              ))}
            </div>
          )}
          {/* Fin Section Horaires */}

          <button
            onClick={() => onPudoSelect(pudo)}
            className={`w-full mt-3 p-1 text-white text-xs rounded transition-colors ${isSelected ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={isSelected}
          >
            {isSelected ? 'Sélectionné' : 'Sélectionner ce Point'}
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export default PudoMarker;