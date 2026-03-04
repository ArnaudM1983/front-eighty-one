# Projet E-commerce "Eighty-One Store"

Ce document fournit une vue d'ensemble complète de l'application e-commerce, construite avec un backend **Symfony** et un frontend **Next.js**. Il décrit l'architecture, les fonctionnalités clés et les flux de données principaux.

---

## 🚀 Stack Technique

*   **Backend**: [Symfony](https://symfony.com/) (PHP) pour l'API RESTful.
*   **Frontend**: [Next.js](https://nextjs.org/) (React, TypeScript) pour une interface utilisateur réactive et optimisée pour le SEO.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) pour un design moderne et personnalisable.
*   **Paiements**: Intégration de [Stripe](https://stripe.com/) et [PayPal](https://www.paypal.com/) pour des transactions sécurisées.
*   **Livraison**: Gestion des points relais avec [Mondial Relay](https://www.mondialrelay.fr/), incluant une carte interactive avec [React Leaflet](https://react-leaflet.js.org/).
*   **Gestion des Cookies**: Conformité RGPD gérée par [Tarteaucitron.js](https://tarteaucitron.io/).

---

## ✨ Fonctionnalités Principales

*   **Gestion de Panier Anonyme**: Un panier est assigné à chaque visiteur via un token unique stocké dans un cookie, permettant une expérience fluide sans connexion obligatoire.
*   **Processus de Commande Complet**: Un tunnel de conversion en plusieurs étapes, de la création de la commande à la confirmation du paiement.
*   **Formulaire d'Adresse Dynamique**: Collecte des informations de facturation et de livraison avec validation des données en temps réel.
*   **Choix de Méthodes de Livraison**: Inclut la livraison standard et la sélection de points relais (PUDO) via une carte interactive.
*   **Multiples Options de Paiement**: Accepte les paiements par carte bancaire (Stripe), PayPal, et le paiement en boutique (COD - Cash on Delivery).
*   **Confirmation de Commande Sécurisée**: Page de confirmation qui vérifie le statut réel du paiement avant de valider la commande.

---

## 🔄 Flux de Données : de l'Ajout au Panier à la Confirmation

Le processus de commande est le cœur de l'application. Voici son déroulement :

1.  **Gestion du Panier (`Cart`)**
    *   Lors de la première visite, le backend crée un panier (`Cart`) avec un `cart_token` unique.
    *   Ce token est stocké dans un cookie `cart_token` côté client.
    *   Toutes les interactions avec le panier (ajout, mise à jour, suppression d'articles) se font via les endpoints `/api/cart/*` en utilisant ce token.

2.  **Création de la Commande (`Order`)**
    *   Sur la page du panier, l'utilisateur clique sur "Commander".
    *   Le frontend envoie une requête `POST /api/order/create` avec le `cartToken`.
    *   Le backend crée une commande (`Order`) en copiant les articles du panier, y associe un paiement (`Payment`) avec le statut `pending`, et retourne l'identifiant de la commande (`orderId`).
    *   L'utilisateur est redirigé vers la page de paiement : `/checkout/{orderId}`.

3.  **Processus de Paiement (`Checkout`)**
    *   La page `/checkout/{orderId}` récupère les détails de la commande via `GET /api/order/{orderId}`.
    *   L'utilisateur remplit le formulaire d'adresse (`ShippingAddressForm`).
    *   Les données d'adresse et la méthode de livraison sont envoyées à `POST /api/order/{orderId}/shipping`.
    *   **Important**: Le backend recalcule les frais de port (`shippingCost`) en se basant sur la méthode choisie pour éviter toute manipulation côté client.
    *   L'utilisateur sélectionne une méthode de paiement (Stripe, PayPal, COD).

4.  **Finalisation et Confirmation**
    *   Après une tentative de paiement (via Stripe/PayPal) ou le choix du COD, l'utilisateur est redirigé vers la page de confirmation : `/order/confirmation/{orderId}`.
    *   **Sécurité**: Cette page ne doit pas se fier uniquement aux paramètres d'URL (ex: `redirect_status=succeeded`). Elle doit idéalement appeler un endpoint backend sécurisé (ex: `GET /api/order/{orderId}/status`) pour vérifier le statut **réel** du paiement, qui est mis à jour de manière fiable par les webhooks des prestataires.
    *   Si le paiement est confirmé, le frontend appelle `DELETE /api/cart/clear` pour vider le panier et le `localStorage`.

---

## 🛠️ Installation et Lancement

### Prérequis
*   Node.js & npm (ou yarn/pnpm)
*   PHP & Composer
*   Un serveur de base de données (ex: MySQL, PostgreSQL)

### 1. Backend (Symfony)
```bash
# 1. Naviguer vers le dossier de l'API (à adapter)
cd ../api

# 2. Installer les dépendances PHP
composer install

# 3. Configurer les variables d'environnement
# Créez un fichier .env.local et configurez la base de données, les clés API Stripe/PayPal, etc.
cp .env .env.local

# 4. Mettre en place la base de données
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

# 5. Lancer le serveur de développement
symfony server:start
```

### 2. Frontend (Next.js)
```bash
# 1. Naviguer vers le dossier du frontend
cd front-eighty-one

# 2. Installer les dépendances Node.js
npm install

# 3. Configurer les variables d'environnement
# Créez un fichier .env.local et définissez l'URL de votre API Symfony.
echo "NEXT_PUBLIC_PROXY_URL=http://127.0.0.1:8000" > .env.local

# 4. Lancer le serveur de développement Next.js
npm run dev
```

L'application frontend sera accessible sur `http://localhost:3000`.

---

## ⚙️ Endpoints API Principaux

Voici les routes principales de l'API Symfony utilisées par le frontend.

| Endpoint | Méthode | Description |
|---|---|---|
| `/api/cart` | `GET` | Récupère le panier actuel via le `cart_token` (cookie). |
| `/api/cart/add` | `POST` | Ajoute un produit au panier. Body: `{ productId, variantId?, quantity }`. |
| `/api/cart/update/{itemId}` | `PUT` | Met à jour la quantité d'un article dans le panier. |
| `/api/cart/remove/{itemId}` | `DELETE` | Supprime un article du panier. |
| `/api/cart/clear` | `DELETE` | Vide le panier (utilisé après une commande réussie). |
| `/api/order/create` | `POST` | Crée une commande à partir d'un panier. Body: `{ cartToken }`. |
| `/api/order/{orderId}` | `GET` | Récupère les détails d'une commande spécifique. |
| `/api/order/{orderId}/shipping` | `POST` | Met à jour l'adresse de livraison et la méthode d'expédition d'une commande. |

---

**Fin du README**
