// src/components/checkout/PudoMap.tsx (Corrigé)

"use client";
import React, { useMemo } from 'react';
// ATTENTION: Ajouter "Popup" ICI
import { MapContainer, TileLayer, useMapEvents, Popup } from 'react-leaflet'; 
import PudoMarker from './PudoMarker';
import { PUDOInfo } from './MondialRelayHandler'; 

// Composant utilitaire pour centrer la carte sur les marqueurs
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMapEvents({});
  map.setView(center);
  return null;
};

interface PudoMapProps {
  pudos: PUDOInfo[];
  onPudoSelect: (pudo: PUDOInfo) => void;
  initialLocationCP: string; 
  isDisabled: boolean;
  selectedPudoId: string | null;
}

const PudoMap: React.FC<PudoMapProps> = ({ 
    pudos, 
    onPudoSelect, 
    initialLocationCP, 
    isDisabled,
    selectedPudoId
}) => {
  
  const centerPosition: [number, number] = useMemo(() => {
    if (pudos.length === 0) {
      // Position par défaut pour Paris si aucun PUDO n'est trouvé
      return [48.8566, 2.3522];
    }
    
    const firstPudo = pudos.find(p => p.latitude && p.longitude);
    if (firstPudo) {
         return [firstPudo.latitude, firstPudo.longitude];
    }

    return [48.8566, 2.3522];
  }, [pudos]);


  if (isDisabled) {
    return (
        <div className="h-96 w-full bg-gray-200 flex items-center justify-center rounded">
            <p className="text-gray-500">
                [Carte désactivée : en attente de calcul de prix ou adresse/poids invalide]
            </p>
        </div>
    );
  }

  return (
    <div className="map-container" style={{ height: '400px' }}>
        
        {/* MESSAGE D'ABSENCE DE PUDO AFFICHÉ AU-DESSUS DE LA CARTE */}
        {pudos.length === 0 && (
            <div className="p-2 mb-2 bg-red-100 text-red-700 rounded text-sm font-medium">
                Aucun Point Relais n'a été trouvé autour de {initialLocationCP}.
            </div>
        )}

      <MapContainer 
        center={centerPosition} 
        zoom={13} 
        scrollWheelZoom={true}
        style={{ height: pudos.length === 0 ? '100px' : '400px', width: '100%' }}
        className="z-0" 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {pudos.length > 0 && <ChangeView center={centerPosition} />}
        
        {/* Rendu des Marqueurs */}
        {pudos.map((pudo) => (
          <PudoMarker 
            key={pudo.id} 
            pudo={pudo} 
            onPudoSelect={onPudoSelect}
            isSelected={selectedPudoId === pudo.id}
          />
        ))}

      </MapContainer>
    </div>
  );
};

export default PudoMap;