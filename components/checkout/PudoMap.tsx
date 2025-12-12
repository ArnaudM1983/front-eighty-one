/**
 * COMPOSANT : PudoMap (Frontend - React Leaflet)
 * * RÔLE :
 * 1. Afficher la carte géographique interactive (Leaflet/OpenStreetMap).
 * 2. Centrer la carte sur le premier Point Relais trouvé (ou sur la position par défaut).
 * 3. Rendre les marqueurs interactifs (`PudoMarker`) pour chaque Point Relais dans la liste `pudos`.
 * 4. Fournir le mécanisme de centrage dynamique (`ChangeView`) après une nouvelle recherche.
 * 5. Transmettre l'action de sélection (`onPudoSelect`) du marqueur au composant parent (MondialRelayHandler).
 * * DÉPENDANCES CLÉS :
 * - React-Leaflet: Librairie pour l'affichage de la carte.
 * - PudoMarker: Composant enfant gérant le marqueur et le popup pour chaque point.
 */
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
const DEFAULT_ZOOM = 13; // zoom par défaut

// Composant utilitaire pour centrer la carte sur les marqueurs
const ChangeView = ({ center, zoom }: { center: LatLngTuple, zoom: number }) => {
  const map = useMapEvents({});
  // setView pour centrer la carte et ajuster le zoom
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
  
  // État pour stocker la position géographique du CP de recherche
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
    
  }, [pudos, initialLocationCP]); 
  
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

        {/* Utilise ChangeView pour forcer le centrage lorsque centerPosition change */}
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