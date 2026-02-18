"use client";

import Breadcrumbs from "@/components/ui/Breadcrumb";
import { useEffect } from "react";

// Déclaration pour TypeScript afin d'éviter les erreurs sur window.tarteaucitron
declare global {
  interface Window {
    tarteaucitron: any;
  }
}

export default function PrivacyPolicy() {
  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Politique de confidentialité" }
  ];

  // Fonction pour ouvrir le gestionnaire de cookies
  const openCookiePanel = () => {
    if (window.tarteaucitron) {
      window.tarteaucitron.userInterface.openPanel();
    }
  };

  return (
    <div className="bg-white pb-20">
      {/* SEO & Meta (Next.js Metadata doit être dans un fichier 'layout.tsx' ou 'page.tsx' Server Component, 
          mais si ce fichier est votre 'page.tsx', déplacez les metadata dans un fichier parent ou un client component séparé) */}
      
      <div className="max-w-6xl mx-auto pt-8 px-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <main className="max-w-4xl mx-auto mt-12 px-6">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 mb-8 leading-none">
          Politique de <span className="text-[#01B0F0]">Confidentialité</span>
        </h1>

        <div className="space-y-12 text-slate-600 leading-relaxed font-medium">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">1. Préambule</h2>
            <p>
              La présente politique de confidentialité a pour but d'exposer aux utilisateurs du site <strong>Eightyone Store</strong> la manière dont sont collectées et traitées leurs données à caractère personnel, conformément à la loi informatique et libertés du 6 janvier 1978 et au RGPD.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">2. Données collectées</h2>
            <p>Dans le cadre de votre commande et de la création de votre compte, nous collectons :</p>
            <ul className="list-none space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-[#01B0F0] font-black">•</span>
                <span><strong>Identité & Contact :</strong> Nom, prénom, adresse de livraison, adresse de facturation, email et téléphone.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#01B0F0] font-black">•</span>
                <span><strong>Données techniques :</strong> Cookies de session pour le panier et statistiques de navigation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#01B0F0] font-black">•</span>
                <span><strong>Paiement :</strong> Vos données bancaires sont traitées exclusivement par nos prestataires sécurisés (Stripe ou PayPal). Eightyone Store n'a jamais accès à votre numéro de carte bancaire complet.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">3. Gestion des Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience d'achat. Certains sont <strong>strictement nécessaires</strong> au fonctionnement de la boutique (panier, session, paiement sécurisé Stripe/PayPal) et ne peuvent pas être désactivés.
            </p>
            <p>
              Pour les autres types de cookies (statistiques, réseaux sociaux), vous pouvez changer d'avis à tout moment en utilisant le bouton ci-dessous :
            </p>
            <button 
              onClick={openCookiePanel}
              className="mt-2 px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#01B0F0] transition-colors rounded-sm"
            >
              Modifier mes préférences cookies
            </button>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">4. Finalité du traitement</h2>
            <p>
              Le traitement de ces données est nécessaire pour :
            </p>
            <ul className="list-disc pl-5 space-y-1">
                <li>La gestion et l'expédition de vos commandes.</li>
                <li>La relation client et le service après-vente.</li>
                <li>Le respect des obligations légales (facturation).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">5. Vos Droits (RGPD)</h2>
            <p>
              Vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression de vos données personnelles. Pour exercer ce droit, il vous suffit de nous contacter :
            </p>
            <ul className="list-none space-y-1 mt-2 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <li><strong>Par email :</strong> eightyone@hotmail.fr</li>
                <li><strong>Par courrier :</strong> Eightyone Store, 21 rue des Capucins, 69001 LYON</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">6. Démarchage téléphonique</h2>
            <p>
              Si votre numéro de téléphone est recueilli à l’occasion de la création de votre compte ou de la passation de votre commande, nous vous informons que vos coordonnées téléphoniques ne seront utilisées que pour la bonne exécution de vos commandes (livraison, notification SMS de retrait).
            </p>
            <p className="text-sm italic">
               Conformément aux dispositions légales, vous pouvez vous inscrire gratuitement sur la liste d’opposition au démarchage téléphonique <strong>Bloctel</strong> (www.bloctel.gouv.fr).
            </p>
          </section>

          <footer className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-10 border-t border-slate-100">
            Dernière mise à jour : 11/02/2026
          </footer>
        </div>
      </main>
    </div>
  );
}