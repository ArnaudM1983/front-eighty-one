# README - Gestion du Panier et Création de Commande

Ce document décrit le **cheminement complet** pour gérer un panier, créer une commande, et préparer le paiement dans le projet Symfony + Next.js.

---

## 1️⃣ Création et récupération d’un panier

### Backend Symfony

* Le **panier** est représenté par l’entité `Cart`.
* Chaque panier possède un **token unique** (`cart_token`) généré automatiquement :

```php
$cart->setToken(bin2hex(random_bytes(16)));
```

* Ce token est utilisé pour identifier le panier **sans avoir besoin d’un utilisateur connecté**.
* Le token est renvoyé dans la réponse JSON et stocké dans un **cookie** `cart_token` pour les prochaines requêtes.

### Endpoints API

| Endpoint                    | Méthode | Description                                                        |
| --------------------------- | ------- | ------------------------------------------------------------------ |
| `/api/cart`                 | GET     | Récupérer le panier via cookie ou query param `cartToken`.         |
| `/api/cart/add`             | POST    | Ajouter un item au panier : `{ productId, variantId?, quantity }`. |
| `/api/cart/update/{itemId}` | PUT     | Mettre à jour la quantité d’un item.                               |
| `/api/cart/remove/{itemId}` | DELETE  | Supprimer un item du panier.                                       |
| `/api/cart/clear`           | DELETE  | Vider le panier.                                                   |

---

## 2️⃣ Création d’une commande

### Backend Symfony

* Endpoint : `/api/order/create` (POST)
* Reçoit le JSON `{ cartToken }`.
* Récupère le panier correspondant au token.
* Crée une **commande** (`Order`) avec :

  * Les items (`OrderItem`) copiés depuis le panier
  * Le token du panier
  * L’utilisateur si connecté (sinon `null`)
* Crée un **paiement initial** (`Payment`) en `pending`.

```php
$order = new Order();
$order->setCartToken($cart->getToken());

foreach ($cart->getItems() as $cartItem) {
    $orderItem = new OrderItem();
    $orderItem->setProduct($cartItem->getProduct());
    $orderItem->setVariant($cartItem->getVariant());
    $orderItem->setQuantity($cartItem->getQuantity());
    $orderItem->setPrice($cartItem->getPrice());
    $order->addItem($orderItem);
}

$payment = new Payment();
$payment->setOrder($order);
$payment->setAmount($order->getTotal());
$payment->setStatus('pending');
```

* Retour JSON :

```json
{
  "success": true,
  "orderId": 1682,
  "total": 35.8
}
```

---

## 3️⃣ Récupération d’une commande

### Backend Symfony

* Endpoint : `/api/order/{orderId}` (GET)
* Retourne la commande avec :

  * Items
  * Paiements
  * Total
  * Status
  * Dates de création et mise à jour

```json
{
  "orderId": 1682,
  "cartToken": "e2f67705e654663cd47f27c15dad59d1",
  "total": 35.8,
  "status": "created",
  "items": [...],
  "payments": [...]
}
```

---

## 4️⃣ Frontend Next.js

### Context du panier

* `CartContext` gère :

  * `cartItems`
  * `cartToken`
  * `updateQuantity`, `removeItem`, `refreshCart`
* `fetchCart()` récupère le panier via API et met à jour le state.

### CartSummary

* Affiche le récapitulatif : sous-total, total, bouton Commander.
* Bouton Commander :

  * Appelle `POST /api/order/create` avec le `cartToken`
  * Redirige vers `/paiement/{orderId}` après création

```ts
const handleCreateOrder = async () => {
  const res = await fetch(`${API_URL}/api/order/create`, {
    method: "POST",
    body: JSON.stringify({ cartToken }),
  });
  const data = await res.json();
  router.push(`/paiement/${data.orderId}`);
};
```

### Page paiement

* Route dynamique : `/paiement/[orderId]`
* Récupère les détails de la commande via `/api/order/{orderId}`
* Affiche les items, total et options de paiement (Stripe, Apple Pay, Google Pay).

---

## 5️⃣ Flow complet

1. L’utilisateur visite le site → panier créé automatiquement avec un token.
2. Ajoute des items → API `/api/cart/add`.
3. Récupère ou met à jour le panier → API `/api/cart`.
4. Clique sur **Commander** → `/api/order/create`.
5. Redirigé vers `/paiement/{orderId}` → récupère la commande et initie le paiement.
6. Paiement final → mise à jour du statut `Payment` (`success` ou `failed`).

---

## 6️⃣ Notes importantes

* Tous les paniers ont un **token unique** pour les visiteurs anonymes.
* Les `Order.total` et `Payment.amount` sont calculés automatiquement via la somme des `OrderItem`.
* Les endpoints sont testables via Postman avec `cartToken` comme query param ou dans le body pour créer la commande.

---

## 7️⃣ Endpoints utiles pour Postman

| Endpoint                  | Méthode | Body                                  | Notes                            |
| ------------------------- | ------- | ------------------------------------- | -------------------------------- |
| `/api/cart?cartToken=...` | GET     | —                                     | Récupérer panier                 |
| `/api/cart/add`           | POST    | `{ productId, quantity, variantId? }` | Ajouter item                     |
| `/api/order/create`       | POST    | `{ cartToken }`                       | Créer commande                   |
| `/api/order/{orderId}`    | GET     | —                                     | Récupérer commande pour paiement |

---

**Fin du README**
