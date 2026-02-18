// Fichier : src/components/ui/Input.tsx

"use client";

import { InputHTMLAttributes } from 'react';
import clsx from 'clsx'; // Souvent nécessaire pour fusionner les classes Tailwind proprement

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Input = (props: Props) => {
  const { label, className, ...rest } = props; // <-- Extraire className explicitement
  
  // Classes de style communes (focus, transition, padding, etc.)
  const baseClasses = `w-full rounded-xl p-4
                       focus:outline-none 
                       focus:ring-1
                       focus:ring-[--primary]
                       focus:ring-opacity-50 
                       focus:border-[--primary]
                       transition duration-150`;

  // Déterminez la classe de bordure par défaut (qui sera surchargée si className est passée)
  // Utiliser clsx pour fusionner les classes existantes avec les classes par défaut
  const finalClasses = clsx(
    "border", // Ajoutez border ici pour qu'il ne soit pas dans baseClasses
    "border-gray-300", // Bordure par défaut
    baseClasses,
    className // Les classes d'erreur (border-red-500) sont ajoutées ici
  );
    
  return (
    <div className="flex flex-col mb-2">
      {label && <label className="mb-1 font-regular text-gray-700">{label}</label>}
      <input
        {...rest}
        className={finalClasses} // Appliquer la classe fusionnée
      />
    </div>
  );
};

export default Input;