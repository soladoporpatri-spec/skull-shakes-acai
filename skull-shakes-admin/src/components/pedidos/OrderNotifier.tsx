"use client";
import { useEffect, useRef, useState } from "react";
import { usePedidos } from "@/hooks/usePedidos";
import { toast } from "sonner";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.error("Audio block", e);
  }
}

export function OrderNotifier() {
  const { data: pedidos } = usePedidos();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const lastMaxId = useRef<number | null>(null);

  useEffect(() => {
    if (!pedidos || pedidos.length === 0) return;

    const currentMaxId = Math.max(...pedidos.map(p => p.id));

    if (lastMaxId.current !== null && currentMaxId > lastMaxId.current) {
      // New order detected!
      const newOrders = pedidos.filter(p => p.id > lastMaxId.current!);
      const hasNewValid = newOrders.some(p => p.statusPedido === "Pending" || p.statusPagamento === "Paid");
      
      if (hasNewValid) {
        toast.success("Novo pedido recebido!");
        if (soundEnabled) {
          playBeep();
        }
      }
    }

    lastMaxId.current = currentMaxId;
  }, [pedidos, soundEnabled]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setSoundEnabled(!soundEnabled)}
      title={soundEnabled ? "Desativar som de notificações" : "Ativar som de notificações"}
      className="w-10 h-10 p-0"
    >
      {soundEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
    </Button>
  );
}
