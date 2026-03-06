import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

function normalizeItem(item) {
  return {
    productId: item.productId,
    name: item.name,
    price: Number(item.price || 0),
    image: item.image || "",
    category: item.category || "",
    quantity: Math.max(1, Number(item.quantity || 1)),
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("sbshop_cart");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) setItems(parsed.map(normalizeItem));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sbshop_cart", JSON.stringify(items));
  }, [items]);

  const api = useMemo(() => {
    const addItem = (product, qty = 1) => {
      const productId = product._id || product.productId;
      if (!productId) return;
      setItems((prev) => {
        const existing = prev.find((p) => p.productId === productId);
        if (existing) {
          return prev.map((p) =>
            p.productId === productId
              ? { ...p, quantity: p.quantity + Math.max(1, Number(qty || 1)) }
              : p
          );
        }
        return [
          ...prev,
          normalizeItem({
            productId,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || product.image || "",
            category: product.category,
            quantity: qty,
          }),
        ];
      });
    };

    const removeItem = (productId) => {
      setItems((prev) => prev.filter((p) => p.productId !== productId));
    };

    const setQuantity = (productId, quantity) => {
      const q = Math.max(1, Number(quantity || 1));
      setItems((prev) =>
        prev.map((p) => (p.productId === productId ? { ...p, quantity: q } : p))
      );
    };

    const clear = () => setItems([]);

    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const count = items.reduce((sum, it) => sum + it.quantity, 0);

    return { items, addItem, removeItem, setQuantity, clear, total, count };
  }, [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

