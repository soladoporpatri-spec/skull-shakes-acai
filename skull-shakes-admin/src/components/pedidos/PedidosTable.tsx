"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageOpen, Search, Eye, ChevronLeft, ChevronRight, ClockAlert, Truck, Store } from "lucide-react";
import { Pedido, OrderStatus, PaymentStatus } from "@/types";
import {
  formatCurrency,
  formatDate,
  orderStatusLabels,
  getPaymentMethodLabel,
  getModalidadeLabel,
} from "@/lib/formatters";
import { OrderStatusBadge, PaymentStatusBadge } from "./StatusBadge";
import { useUpdatePedidoStatus } from "@/hooks/usePedidos";
import PedidoSheet from "./PedidoSheet";
import { differenceInMinutes, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PedidosTableProps {
  pedidos: Pedido[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

const ITEMS_PER_PAGE = 10;

const allStatuses: OrderStatus[] = [
  "Pending",
  "PaymentPending",
  "Paid",
  "Processing",
  "Shipped",
  "Delivered",
  "Canceled",
];

const allPaymentMethods = ["Pix", "CreditCard", "DebitCard", "Cash"];

export default function PedidosTable({
  pedidos,
  isLoading,
  isError,
}: PedidosTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [page, setPage] = useState(1);

  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const updateStatusMutation = useUpdatePedidoStatus();


  // Debounced search
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  const filteredPedidos = React.useMemo(() => {
    if (!pedidos) return [];
    let filtered = [...pedidos];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nomeCliente.toLowerCase().includes(q) ||
          p.telefone.includes(q) ||
          p.id.toString() === q
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.statusPedido === statusFilter);
    }

    if (paymentFilter !== "all") {
      filtered = filtered.filter((p) => p.formaPagamento === paymentFilter);
    }

    if (dateFrom) {
      filtered = filtered.filter(
        (p) => new Date(p.dataPedido) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((p) => new Date(p.dataPedido) <= end);
    }

    // Sort by Date descending
    filtered.sort(
      (a, b) =>
        new Date(b.dataPedido).getTime() - new Date(a.dataPedido).getTime()
    );

    return filtered;
  }, [pedidos, searchQuery, statusFilter, paymentFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredPedidos.length / ITEMS_PER_PAGE);
  const paginatedPedidos = filteredPedidos.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const openSheet = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setSheetOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-9 w-48" />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <PackageOpen className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">Erro ao carregar pedidos</p>
        <p className="text-sm">Verifique se a API esta online e tente novamente.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente ou telefone..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8 w-64"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Status do pedido" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {allStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {orderStatusLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={paymentFilter} onValueChange={(v) => { setPaymentFilter(v); setPage(1); }}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Forma de pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as formas</SelectItem>
            {allPaymentMethods.map((m) => (
              <SelectItem key={m} value={m}>
                {paymentMethodLabels[m]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="w-40" />
        <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="w-40" />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant={statusFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => {setStatusFilter('all'); setPage(1);}}>Todos</Button>
        <Button variant={statusFilter === 'Pending' ? 'default' : 'outline'} size="sm" onClick={() => {setStatusFilter('Pending'); setPage(1);}}>Novos</Button>
        <Button variant={statusFilter === 'Processing' ? 'default' : 'outline'} size="sm" onClick={() => {setStatusFilter('Processing'); setPage(1);}}>Em Preparo</Button>
        <Button variant={statusFilter === 'Ready' ? 'default' : 'outline'} size="sm" onClick={() => {setStatusFilter('Ready'); setPage(1);}}>Prontos</Button>
        <Button variant={statusFilter === 'InTransit' ? 'default' : 'outline'} size="sm" onClick={() => {setStatusFilter('InTransit'); setPage(1);}}>Em Entrega</Button>
      </div>

      {filteredPedidos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <PackageOpen className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">Nenhum pedido encontrado</p>
          <p className="text-sm">Tente ajustar os filtros de busca.</p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Modalidade</TableHead>
                  <TableHead>Tempo</TableHead>
                  <TableHead>Status Pedido</TableHead>
                  <TableHead>Status Pagamento</TableHead>
                  <TableHead>Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPedidos.map((pedido) => {
                  const dataPed = new Date(pedido.dataPedido);
                  const minutesDiff = differenceInMinutes(new Date(), dataPed);
                  const isAtrasado = minutesDiff > 120 && !['Delivered', 'Cancelled', 'Refunded'].includes(pedido.statusPedido);
                  const tempoFormatado = formatDistanceToNow(dataPed, { locale: ptBR });
                  const modalidade = getModalidadeLabel(pedido.modalidadePagamento);

                  return (
                    <TableRow key={pedido.id}>
                      <TableCell className="font-mono text-xs">#{pedido.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{pedido.nomeCliente}</p>
                          <p className="text-xs text-muted-foreground">{pedido.telefone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(pedido.total)}</TableCell>
                      <TableCell className="text-sm font-medium">{getPaymentMethodLabel(pedido.formaPagamento)}</TableCell>
                      <TableCell className="text-sm">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${modalidade.icon === 'delivery' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                          {modalidade.icon === 'delivery' ? <Truck className="w-3 h-3" /> : <Store className="w-3 h-3" />}
                          {modalidade.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {isAtrasado ? (
                          <div className="flex items-center text-red-500 font-bold text-xs">
                            <ClockAlert className="w-3 h-3 mr-1" /> ATRASADO
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-xs">{tempoFormatado}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={pedido.statusPedido}
                          onValueChange={(val) => {
                            updateStatusMutation.mutate({
                              id: pedido.id,
                              status: val as OrderStatus,
                            });
                          }}
                          disabled={updateStatusMutation.isPending}
                        >
                          <SelectTrigger className="h-9 w-fit border-0 bg-transparent hover:bg-white/5 focus:ring-0 px-2 py-1 shadow-none gap-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {allStatuses.map((s) => (
                              <SelectItem key={s} value={s}>
                                <OrderStatusBadge status={s as OrderStatus} />
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={pedido.statusPagamento}
                          onValueChange={(val) => {
                            updateStatusMutation.mutate({
                              id: pedido.id,
                              status: pedido.statusPedido,
                              paymentStatus: val as PaymentStatus,
                            });
                          }}
                          disabled={updateStatusMutation.isPending}
                        >
                          <SelectTrigger className="h-9 w-fit border-0 bg-transparent hover:bg-white/5 focus:ring-0 px-2 py-1 shadow-none gap-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["Pending", "Processing", "Paid", "Failed", "Canceled", "Expired", "Refunded"].map((s) => (
                              <SelectItem key={s} value={s}>
                                <PaymentStatusBadge status={s as PaymentStatus} />
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => openSheet(pedido)}>
                          <Eye className="h-4 w-4 mr-1" /> Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, filteredPedidos.length)} de {filteredPedidos.length} pedidos
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="flex items-center px-3 text-sm text-muted-foreground">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      <PedidoSheet pedido={selectedPedido} open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  );
}
