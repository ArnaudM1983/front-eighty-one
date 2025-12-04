import Cookies from "js-cookie";

export async function addToCart(
  productId: number,
  variantId: number | null,
  quantity: number
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // pour gérer automatiquement les cookies
    body: JSON.stringify({ productId, variantId, quantity }),
  });

  const data = await res.json();

  // Stocker le token du panier si renvoyé
  if (data.cartToken) {
    Cookies.set("cart_token", data.cartToken, { expires: 7 });
  }

  return data;
}

export async function getCart() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart`, {
    credentials: "include", // cookies envoyés automatiquement
  });
  return res.json();
}

/**
 * Met à jour la quantité d'un article dans le panier
 * Vérifie le stock côté serveur
 */
export async function updateCartQuantity(itemId: number, quantity: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/cart/update/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const msg = data?.message || `Erreur serveur (${res.status})`;
    throw new Error(msg);
  }

  return res.json();
}
