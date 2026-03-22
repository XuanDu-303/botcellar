"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import useCartStore from "./use-cart-store";

export default function useSyncCart() {
  const { data: session } = useSession();
  const { cart, setCart } = useCartStore();

  // Đồng bộ cart từ server
  useEffect(() => {
    if (!session) return;

    const syncServerCart = async () => {
      const res = await fetch("/api/cart");
      if (!res.ok) return;
      const serverCart = await res.json();
      if (serverCart) setCart(serverCart);
    };

    syncServerCart();
  }, [session?.user.id]);

  // Lưu cart vào server khi thay đổi
  useEffect(() => {
    if (!session || !cart || cart.items.length === 0) return;

    const persistCart = async () => {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart),
      });
    };

    persistCart();
  }, [session?.user.id, cart]);
}
