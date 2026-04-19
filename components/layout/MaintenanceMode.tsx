import React from 'react';

const MaintenanceMode = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Eighty One Store</h1>
      <div className="w-16 h-1 bg-black mb-6"></div>
      <p className="text-lg text-gray-600 max-w-md">
        Notre nouvelle boutique en ligne arrive très bientôt. 
        Nous effectuons les derniers réglages techniques.
      </p>
      <p className="mt-8 animate-pulse text-sm font-medium text-gray-400 uppercase tracking-widest">
        Ouverture imminente
      </p>
    </div>
  );
};

export default MaintenanceMode;