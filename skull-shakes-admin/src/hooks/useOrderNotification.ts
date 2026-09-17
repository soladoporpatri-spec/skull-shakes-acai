import { useEffect, useRef } from 'react';
import { Pedido } from '@/types';

export function useOrderNotification(pedidos: Pedido[] | undefined) {
  const previousMaxIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!pedidos || pedidos.length === 0) return;

    // Find the highest ID in the current orders
    const currentMaxId = Math.max(...pedidos.map(p => p.id));

    // If we have a previous max ID and the current one is higher, it's a new order!
    if (previousMaxIdRef.current !== null && currentMaxId > previousMaxIdRef.current) {
      try {
        const audio = new Audio('/notification.wav');
        // We use catch because browsers block autoplay if user hasn't interacted with page
        audio.play().catch(e => console.warn('Audio play failed (browser policy):', e));
      } catch (err) {
        console.error('Failed to play audio:', err);
      }
    }

    // Update the ref
    previousMaxIdRef.current = currentMaxId;
  }, [pedidos]);
}
