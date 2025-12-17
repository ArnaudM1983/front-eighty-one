import { useState, useEffect } from 'react';

export const useExternalScript = (url: string, callback?: () => void) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!url) return;
        
        const existingScript = document.querySelector(`script[src="${url}"]`);
        if (existingScript) {
            setLoaded(true);
            callback?.();
            return;
        }

        const script = document.createElement('script');
        script.src = url;
        script.async = false; // Important pour l'ordre d'exécution
        script.onload = () => {
            setLoaded(true);
            callback?.(); // Exécuter le callback (ex: exposer jQuery)
        };
        document.body.appendChild(script);
    }, [url]);

    return loaded;
};