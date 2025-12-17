// /**
//  * COMPOSANT : ColissimoHandler (Frontend - React/Leaflet)
//  * * RÔLE :
//  * 1. Fournir l'interface utilisateur pour la sélection d'un point Colissimo.
//  * 2. Gérer la recherche de points via l'API REST Colissimo.
//  * 3. Réutiliser le composant PudoMap pour l'affichage.
//  */
// "use client";
// import React, { useState, useEffect, useCallback } from 'react';
// import dynamic from 'next/dynamic';
// import { PUDOInfo } from './MondialRelayHandler'; // Récupération des interfaces communes

// const PudoMap = dynamic(() => import('./PudoMap'), {
//     ssr: false,
//     loading: () => <div className="h-96 w-full bg-gray-200 flex items-center justify-center rounded"><p className="text-gray-500">Chargement de la carte...</p></div>,
// });

// interface ColissimoHandlerProps {
//     totalWeight: number;
//     orderId: string;
//     setShippingPrice: (price: number) => void;
//     setSelectedPudo: (pudo: PUDOInfo) => void;
//     setShippingMethod: (method: string) => void;
//     currentPrice: number;
//     customerPostalCode: string;
//     customerCountryCode: string;
//     customerAddress: string; // Ajouté pour la précision Colissimo
// }

// const MODE_ID = 'colissimo_pr';
// const MODE_CODE = 'pr'; // Code pour votre TariffCalculatorService

// const ColissimoHandler: React.FC<ColissimoHandlerProps> = ({
//     totalWeight,
//     orderId,
//     setShippingPrice,
//     setSelectedPudo,
//     setShippingMethod,
//     currentPrice,
//     customerPostalCode,
//     customerCountryCode,
//     customerAddress
// }) => {
//     const [loadingPrice, setLoadingPrice] = useState(false);
//     const [loadingPudos, setLoadingPudos] = useState(false);
//     const [localPudo, setLocalPudo] = useState<PUDOInfo>(null);
//     const [error, setError] = useState<string | null>(null);
//     const [pudosList, setPudosList] = useState<PUDOInfo[]>([]);

//     const [searchPostalCode, setSearchPostalCode] = useState(customerPostalCode || '');
//     const [searchTrigger, setSearchTrigger] = useState(0);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [mapKey, setMapKey] = useState(0);

//     const effectiveCountryCode = customerCountryCode || 'FR';

//     const hasValidCoords = (p: PUDOInfo): p is PUDOInfo => {
//         return (p !== null && typeof p.latitude === 'number' && typeof p.longitude === 'number' && p.latitude !== 0);
//     };

//     // Initialisation
//     useEffect(() => {
//         setShippingMethod(MODE_ID);
//         setSelectedPudo(null);
//         setLocalPudo(null);
//     }, [setShippingMethod, setSelectedPudo]);

//     // --- CALCUL DU PRIX COLISSIMO ---
//     useEffect(() => {
//         if (totalWeight <= 0) return;

//         const calculatePrice = async () => {
//             setLoadingPrice(true);
//             try {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/shipping/calculate`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         totalWeight: totalWeight,
//                         modeCode: 'colissimo_pr', // Match votre table shipping_tariff
//                         countryCode: effectiveCountryCode,
//                     }),
//                 });

//                 if (!res.ok) throw new Error("Erreur de calcul Colissimo.");
//                 const data = await res.json();
//                 setShippingPrice(data.shippingCost ? parseFloat(data.shippingCost) : 0);
//             } catch (err: any) {
//                 setError("Calcul de tarif Colissimo impossible.");
//             } finally {
//                 setLoadingPrice(false);
//             }
//         };
//         calculatePrice();
//     }, [totalWeight, effectiveCountryCode]);

//     // --- RECHERCHE PUDO COLISSIMO ---
//     useEffect(() => {
//         if (loadingPrice || currentPrice <= 0 || searchTrigger === 0 || searchPostalCode.length < 5) return;

//         setLoadingPudos(true);
//         setError(null);

//         const fetchColissimoPudos = async () => {
//             try {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/order/colissimo/pudo/search`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         postalCode: searchPostalCode,
//                         city: ' ', // Forcer une chaîne non vide
//                         address: customerAddress || ' ', // Forcer une chaîne non vide pour éviter la 400
//                         countryCode: effectiveCountryCode,
//                         totalWeight: totalWeight,
//                     }),
//                 });

//                 const data = await res.json();

//                 if (!res.ok) {
//                     // Utilise 'details' envoyé par notre nouveau contrôleur Symfony
//                     throw new Error(data.details || "Erreur lors de la recherche");
//                 }

//                 const pudos = data.pudos || [];

//                 if (pudos.filter(hasValidCoords).length === 0) {
//                     throw new Error("Aucun point trouvé pour ce code postal.");
//                 }

//                 setPudosList(pudos);
//                 setMapKey(prev => prev + 1);
//             } catch (err: any) {
//                 setError(err.message);
//                 setPudosList([]);
//             } finally {
//                 setLoadingPudos(false);
//             }
//         };

//         fetchColissimoPudos();
//     }, [searchTrigger, currentPrice]);

//     const handleMapPudoSelect = useCallback((pudoData: PUDOInfo) => {
//         setLocalPudo(pudoData);
//         setSelectedPudo(pudoData);
//         setIsModalOpen(false);
//     }, [setSelectedPudo]);

//     const handleSearchClick = () => {
//         if (searchPostalCode.length >= 5) setSearchTrigger(prev => prev + 1);
//     };

//     const handleOpenModal = () => {
//         setIsModalOpen(true);
//         if (searchTrigger === 0 && searchPostalCode.length >= 5) setSearchTrigger(1);
//     };

//     const isDisabled = loadingPrice || currentPrice <= 0 || !!error;
//     const isPudoSelected = localPudo !== null;

//     return (
//         <div className='colissimo-handler'>
//             {error && <div className="mt-2 p-2 rounded text-sm text-red-700 bg-red-100">{error}</div>}

//             <div className="p-4 rounded border border-blue-100 bg-blue-50/30">
//                 {isPudoSelected && (
//                     <div className="mb-4 p-3 bg-white border border-blue-200 rounded shadow-sm">
//                         <p className="font-semibold text-sm text-blue-800">📍 Point Colissimo :</p>
//                         <p className="text-sm">{localPudo?.name}</p>
//                         <p className="text-xs text-gray-500">{localPudo?.address}, {localPudo?.postalCode} {localPudo?.city}</p>
//                     </div>
//                 )}

//                 <button
//                     onClick={handleOpenModal}
//                     disabled={isDisabled}
//                     className="w-full p-2 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors cursor-pointer"
//                 >
//                     {isPudoSelected ? 'Modifier le point de retrait' : 'Choisir un point Colissimo'}
//                 </button>
//             </div>

//             {isModalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsModalOpen(false)}>
//                     <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//                         <div className="flex justify-between items-center mb-4 border-b pb-2">
//                             <h3 className="text-xl font-bold">Points de retrait Colissimo</h3>
//                             <button onClick={() => setIsModalOpen(false)} className="text-2xl">&times;</button>
//                         </div>

//                         <div className="mb-4 flex gap-2">
//                             <input
//                                 type="text"
//                                 value={searchPostalCode}
//                                 onChange={(e) => setSearchPostalCode(e.target.value.substring(0, 5))}
//                                 placeholder="Code Postal"
//                                 className="p-2 border rounded-md text-sm w-32"
//                             />
//                             <button
//                                 onClick={handleSearchClick}
//                                 disabled={loadingPudos}
//                                 className='px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600'
//                             >
//                                 {loadingPudos ? 'Recherche...' : 'Rechercher'}
//                             </button>
//                         </div>

//                         <div className='pudo-map-container h-96'>
//                             {pudosList.length > 0 ? (
//                                 <PudoMap
//                                     key={mapKey}
//                                     pudos={pudosList}
//                                     onPudoSelect={handleMapPudoSelect}
//                                     initialLocationCP={searchPostalCode}
//                                     isDisabled={isDisabled}
//                                     selectedPudoId={localPudo?.id || null}
//                                 />
//                             ) : (
//                                 <div className="h-full w-full bg-gray-100 flex items-center justify-center rounded">
//                                     <p className="text-gray-500 italic">
//                                         {loadingPudos ? "Chargement des points..." : "Saisissez un code postal pour voir les points de retrait."}
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ColissimoHandler;