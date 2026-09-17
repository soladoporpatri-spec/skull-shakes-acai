import { create } from 'zustand';

export interface CartOption {
  id: number;
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // The base product id
  cartItemId?: string; // Unique identifier for the item with specific options
  name: string;
  price: number;
  quantity: number;
  options?: CartOption[];
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

const generateCartItemId = (item: CartItem) => {
  if (!item.options || item.options.length === 0) return item.id;
  const optionsString = [...item.options].sort((a, b) => a.name.localeCompare(b.name)).map(o => o.name).join('|');
  return `${item.id}|${optionsString}`;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      const cartItemId = item.cartItemId || generateCartItemId(item);
      const existing = state.items.find((i) => (i.cartItemId || i.id) === cartItemId);
      
      const itemOptionsTotal = item.options?.reduce((sum, opt) => sum + opt.price, 0) || 0;
      const basePrice = item.price; // We store the base price in item.price, options are added to getTotal, or we sum it upfront.
      // Wait, let's just make item.price = basePrice + optionsTotal before it enters the store for simplicity, 
      // or we handle it in getTotal. If we assume item.price passed to addItem already includes the options, it's easier.
      // Let's assume item.price passed to addItem ALREADY includes options price.

      if (existing) {
        return {
          items: state.items.map((i) =>
            (i.cartItemId || i.id) === cartItemId ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, cartItemId }] };
    });
  },
  removeItem: (cartItemId) => {
    set((state) => ({ items: state.items.filter((i) => (i.cartItemId || i.id) !== cartItemId) }));
  },
  updateQuantity: (cartItemId, quantity) => {
    set((state) => ({
      items: state.items.map((i) => ((i.cartItemId || i.id) === cartItemId ? { ...i, quantity } : i)),
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
