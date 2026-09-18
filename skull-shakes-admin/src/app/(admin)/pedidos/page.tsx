"use client";

import React from "react";
import PedidosTable from "@/components/pedidos/PedidosTable";
import { usePedidos } from "@/hooks/usePedidos";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function PedidosPage() {
  const { data: pedidos, isLoading, isError } = usePedidos();

  const exportToCSV = () => {
    if (!pedidos) return;
    const headers = ['ID', 'Cliente', 'Telefone', 'Total', 'FormaPagamento', 'StatusPedido', 'StatusPagamento', 'Data'];
    const rows = pedidos.map(p => [
      p.id, p.nomeCliente, p.telefone, p.total, p.formaPagamento, p.statusPedido, p.statusPagamento, new Date(p.dataPedido).toLocaleString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pedidos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pedidos</h2>
          <p className="text-muted-foreground">
            Gerencie os pedidos em tempo real.
          </p>
        </div>
        <Button variant="outline" onClick={exportToCSV}><Download className="h-4 w-4 mr-2" /> Exportar CSV</Button>
      </div>
      <PedidosTable pedidos={pedidos} isLoading={isLoading} isError={isError} />
    </div>
  );
}
