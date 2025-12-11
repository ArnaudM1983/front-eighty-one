
"use client";
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { PUDOInfo } from './MondialRelayHandler'; // Assurez-vous que le type PUDOInfo est bien exporté de MondialRelayHandler

// Définition de l'icône Leaflet par défaut (nécessaire car Webpack ne gère pas bien les URL par défaut)
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

  // Créer une icône verte si sélectionné
  const selectedIcon = L.icon({
    ...customIcon.options,
    iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg fill="#00AA00" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>')
  });
  
  // Utiliser l'icône verte si le point est sélectionné, sinon l'icône par défaut
  const iconToUse = isSelected ? customIcon : customIcon; 

  return (
    <Marker 
        position={[pudo.latitude, pudo.longitude]} 
        icon={iconToUse} // Utilisez customIcon car Leaflet ne gère pas le SVG facilement sans plugin
    >
      <Popup>
        <div className="text-sm">
          <p className="font-semibold">{pudo.name}</p>
          <p>{pudo.address}</p>
          <p className="mb-2">{pudo.postalCode} {pudo.city}</p>
          <button
            onClick={() => onPudoSelect(pudo)}
            className={`w-full p-1 text-white text-xs rounded transition-colors ${isSelected ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
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