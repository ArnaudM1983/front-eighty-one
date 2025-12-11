// src/components/checkout/PudoMap.tsx

"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { 
    MapContainer, 
    TileLayer, 
    useMapEvents, 
    Popup
} from 'react-leaflet'; 
import { LatLngTuple } from 'leaflet'; 
import PudoMarker from './PudoMarker';
import { PUDOInfo } from './MondialRelayHandler'; 

// Position par défaut (Lyon, France) si aucun PUDO n'est trouvé
const DEFAULT_CENTER: LatLngTuple = [45.764043, 4.835659]; 
const DEFAULT_ZOOM = 13; // Définir un zoom par défaut

// Composant utilitaire pour centrer la carte sur les marqueurs
const ChangeView = ({ center, zoom }: { center: LatLngTuple, zoom: number }) => {
  const map = useMapEvents({});
  // Utilise setView pour centrer la carte et ajuster le zoom
  map.setView(center, zoom);
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
  
  // 💡 NOUVEAU: État pour stocker la position géographique du CP de recherche
  // Vous devriez remplir cet état si votre API fournissait des coordonnées pour le CP.
  // Pour l'instant, nous le laissons vide et nous nous basons uniquement sur les PUDOs.
  const [centerCoords, setCenterCoords] = useState<LatLngTuple>(DEFAULT_CENTER);

  
  useEffect(() => {
    // Si des PUDOs sont trouvés, centrez sur le premier PUDO
    const firstPudoWithCoords = pudos
      .filter((p): p is PUDOInfo => p !== null) 
      .find(p => 
        p.latitude !== undefined && p.longitude !== undefined && 
        p.latitude !== null && p.longitude !== null &&
        typeof p.latitude === 'number' && typeof p.longitude === 'number'
      );
      
    if (firstPudoWithCoords) {
        setCenterCoords([firstPudoWithCoords.latitude, firstPudoWithCoords.longitude] as LatLngTuple);
    } 
    // Si la recherche ne trouve rien, on pourrait vouloir rester sur le CP précédent
    // ou revenir au centre par défaut. Si l'utilisateur a recherché, on ne change rien.
    // L'important est de ne pas changer le centre si ce n'est pas nécessaire.
    // Si vous aviez un service de géocodage de CP, ce serait l'endroit pour l'appeler.
    // Pour l'instant, on laisse le dernier centre connu (ou DEFAULT_CENTER).
    
    // Note: Si vous aviez un moyen de géocoder `initialLocationCP` ici, ce serait la meilleure solution.
    // Exemple conceptuel: geocode(initialLocationCP).then(coords => setCenterCoords(coords))
    
  }, [pudos, initialLocationCP]); 
  
  
  // La position de centrage est désormais centerCoords
  const centerPosition = centerCoords;


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
      
      <MapContainer 
        // center est LatLngTuple et est valide. Il sera écrasé par ChangeView.
        center={centerPosition} 
        zoom={DEFAULT_ZOOM} 
        scrollWheelZoom={true}
        style={{ height: '400px', width: '100%' }}
        className="z-0" 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 💡 Utilise ChangeView pour forcer le centrage lorsque centerPosition change */}
        <ChangeView center={centerPosition} zoom={DEFAULT_ZOOM} />
        
        {/* Rendu des Marqueurs */}
        {pudos.map((pudo) => (
          pudo && (
            <PudoMarker 
                key={pudo.id} 
                pudo={pudo} 
                onPudoSelect={onPudoSelect}
                isSelected={selectedPudoId === pudo.id}
            />
          )
        ))}

      </MapContainer>
    </div>
  );
};

export default PudoMap;