"use client";

import React, { useMemo } from "react";
import { usePedidos } from "@/hooks/usePedidos";
import MetricCard from "@/components/dashboard/MetricCard";
import ReceitaChart from "@/components/dashboard/ReceitaChart";
import PagamentosPieChart from "@/components/dashboard/PagamentosPieChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/pedidos/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  AlertCircle,
  PackageOpen,
} from "lucide-react";
import { isToday, differenceInMinutes } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data: pedidos, isLoading } = usePedidos();
  const queryClient = useQueryClient();

  const limparMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/admin/pedidos/limpar");
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Limpeza realizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
    onError: () => {
      toast.error("Erro ao realizar limpeza de cache.");
    }
  });

  const handleLimpeza = () => {
    if (confirm("Tem certeza que deseja limpar o cache e remover os pedidos antigos já finalizados? Isso melhorará a performance da Dashboard.")) {
      limparMutation.mutate();
    }
  };


  const { metrics, alerts } = useMemo(() => {
    if (!pedidos) {
      return {
        metrics: { todayOrders: 0, todayRevenue: 0, processing: 0, paymentPending: 0 },
        alerts: []
      };
    }

    const todayPedidos = pedidos.filter((p) => {
      try {
        return isToday(new Date(p.dataPedido));
      } catch {
        return false;
      }
    });

    const todayRevenue = todayPedidos
      .filter((p) => p.statusPagamento === "Paid")
      .reduce((sum, p) => sum + p.total, 0);

    const processing = pedidos.filter((p) => p.statusPedido === "Processing").length;
    const paymentPending = pedidos.filter((p) => p.statusPedido === "PaymentPending").length;
    const paymentFailed = pedidos.filter((p) => p.statusPagamento === "Failed").length;
    
    // Delayed orders (> 2h)
    const delayed = pedidos.filter((p) => {
       const diff = differenceInMinutes(new Date(), new Date(p.dataPedido));
       return diff > 120 && !['Delivered', 'Cancelled', 'Refunded'].includes(p.statusPedido);
    }).length;

    const arr = [];
    if (delayed > 0) arr.push(`${delayed} pedido(s) ATRASADO(S)`);
    if (paymentFailed > 0) arr.push(`${paymentFailed} pagamento(s) RECUSADO(S)`);
    if (paymentPending > 0) arr.push(`${paymentPending} aguardando pagamento`);

    return {
      metrics: {
        todayOrders: todayPedidos.length,
        todayRevenue,
        processing,
        paymentPending,
      },
      alerts: arr
    };
  }, [pedidos]);

  const recentPedidos = useMemo(() => {
    if (!pedidos) return [];
    return [...pedidos]
      .sort((a, b) => new Date(b.dataPedido).getTime() - new Date(a.dataPedido).getTime())
      .slice(0, 10);
  }, [pedidos]);

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleLimpeza} 
          disabled={limparMutation.isPending}
          className="shadow-sm"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {limparMutation.isPending ? "Limpando..." : "Limpar Cache & Antigos"}
        </Button>
      </div>

      {/* Alertas */}
      {!isLoading && alerts.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <h3 className="text-destructive font-semibold flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4" /> Atenção Necessária
          </h3>
          <div className="flex flex-wrap gap-3">
            {alerts.map((msg, i) => (
              <div key={i} className="bg-destructive/10 text-destructive text-sm font-medium px-3 py-1.5 rounded border border-destructive/20">
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Pedidos Hoje" value={metrics.todayOrders} icon={ShoppingBag} loading={isLoading} description="Total de pedidos do dia" />
        <MetricCard title="Receita Hoje" value={formatCurrency(metrics.todayRevenue)} icon={DollarSign} loading={isLoading} description="Receita de pagamentos aprovados" />
        <MetricCard title="Em Preparo" value={metrics.processing} icon={Clock} loading={isLoading} description="Pedidos na cozinha" />
        <MetricCard title="Aguardando Pagamento" value={metrics.paymentPending} icon={AlertCircle} loading={isLoading} description="Pix ou Cartão pendente" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReceitaChart pedidos={pedidos || []} loading={isLoading} />
        <PagamentosPieChart pedidos={pedidos || []} loading={isLoading} />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Últimos Pedidos</CardTitle>
          <Link href="/pedidos" className="text-sm text-accent hover:text-accent/80 transition-colors">
            Ver todos »
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : recentPedidos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <PackageOpen className="h-10 w-10 mb-3" />
              <p>Nenhum pedido encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPedidos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">#{p.id}</TableCell>
                    <TableCell className="text-sm">{p.nomeCliente}</TableCell>
                    <TableCell className="text-sm font-medium">{formatCurrency(p.total)}</TableCell>
                    <TableCell><OrderStatusBadge status={p.statusPedido} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(p.dataPedido)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
