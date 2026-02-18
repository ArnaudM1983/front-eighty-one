"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    tarteaucitron: any;
  }
}

export default function CookieBanner() {
  useEffect(() => {
    const initTarteAuCitron = () => {
      if (window.tarteaucitron) {
        window.tarteaucitron.init({
          "privacyUrl": "/politique-de-confidentialite",
          "bodyPosition": "bottom", 
          "hashtag": "#tarteaucitron",
          "cookieName": "tarteaucitron",
          "orientation": "bottom",
          "groupServices": true,
          "serviceDefaultState": "wait",
          "showAlertSmall": false,
          "cookieslist": true,
          "closePopup": false,
          "showIcon": true,
          "iconPosition": "BottomRight",
          "adblocker": false,
          "DenyAllCta" : true,
          "AcceptAllCta" : true,
          "highPrivacy": true,
          "handleBrowserDNTRequest": false,
          "removeCredit": false,
          "moreInfoLink": true,
          "useExternalCss": false,
          "readmoreLink": "/politique-de-confidentialite"
        });

        // Exemple : Ajout de Google Analytics 
        // (window.tarteaucitron.job = window.tarteaucitron.job || []).push('gtag');
      }
    };

    const timer = setTimeout(initTarteAuCitron, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/gh/AmauriC/tarteaucitron.js@latest/tarteaucitron.js"
        strategy="afterInteractive"
      />
    </>
  );
}