/**
 * COMPOSANT : PudoMap (Frontend - React Leaflet)
 * * RÔLE :
 * 1. Afficher la carte géographique interactive (Leaflet/OpenStreetMap) dans la modale.
 * 2. Gérer le centrage dynamique de la carte en fonction des PUDOs trouvés.
 * 3. Correction du problème de centrage et de taille qui survient lorsque la carte est dans une modale.
 * 4. Rendre les marqueurs interactifs (`PudoMarker`) pour chaque Point Relais dans la liste `pudos`.
 * * DÉPENDANCES CLÉS :
 * - React-Leaflet: Librairie pour l'affichage de la carte.
 * - PudoMarker: Composant enfant gérant le marqueur et le popup pour chaque point.
 */
"use client";
import React, { useState, useEffect } from 'react';
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
// Cette position est utilisée initialement et si la recherche ne renvoie aucun PUDO valide.
const DEFAULT_CENTER: LatLngTuple = [45.764043, 4.835659]; 
const DEFAULT_ZOOM = 13; // zoom par défaut

/**
 * Composant utilitaire pour centrer la carte et ajuster la taille (nécessaire dans les Modales).
 */
const ChangeView = ({ center, zoom }: { center: LatLngTuple, zoom: number }) => {
  const map = useMapEvents({});
  
  // 💡 CORRECTION DU PROBLÈME DE MODALE/CENTREMENT : 
  // map.invalidateSize() force Leaflet à recalculer sa taille et son centre
  // une fois que le conteneur (la modale) est affiché et que le centre a été mis à jour.
  useEffect(() => {
    map.invalidateSize(); 
    map.setView(center, zoom); // Centre la vue après l'invalidation de la taille
  }, [map, center, zoom]); 

  // L'appel setView doit être fait ici car les hooks Leaflet ne peuvent pas être dans PudoMap directement
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
  
  // État pour stocker la position géographique du CP de recherche / 1er PUDO trouvé
  const [centerCoords, setCenterCoords] = useState<LatLngTuple>(DEFAULT_CENTER);

  
  useEffect(() => {
    // 💡 Type Guard pour valider qu'un PUDO a des coordonnées utilisables
    const hasValidCoords = (p: PUDOInfo): p is PUDOInfo => {
        return (
            p !== null && 
            typeof p.latitude === 'number' && 
            typeof p.longitude === 'number'
        );
    };

    // Trouver le premier PUDO qui a des coordonnées valides
    const firstPudoWithCoords = pudos.find(hasValidCoords);
      
    if (firstPudoWithCoords) {
        // Si trouvé, on met à jour le centre (ce qui déclenche ChangeView)
        setCenterCoords([firstPudoWithCoords.latitude, firstPudoWithCoords.longitude] as LatLngTuple);
    } 
    // Sinon, on garde le centre existant (Lyon par défaut)
    
  }, [pudos, initialLocationCP]);
  
    // La position de centrage transmise à ChangeView
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
        // L'initial center est utilisé la première fois que la carte est rendue.
        // ChangeView prend le relais ensuite.
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

        {/* 💡 Utilise ChangeView pour forcer le centrage après la recherche */}
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