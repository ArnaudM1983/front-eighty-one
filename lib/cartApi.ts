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
