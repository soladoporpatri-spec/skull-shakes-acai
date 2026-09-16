"use client";



import React, { useState, useMemo, useCallback } from "react";

import {

  Table,

  TableBody,

  TableCell,

  TableHead,

  TableHeader,

  TableRow,

} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {

  Select,

  SelectContent,

  SelectItem,

  SelectTrigger,

  SelectValue,

} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";

import { OrderStatusBadge, PaymentStatusBadge } from "./StatusBadge";

import PedidoSheet from "./PedidoSheet";

import { Pedido, OrderStatus, PaymentMethod } from "@/types";

import {

  formatCurrency,

  formatDate,

  paymentMethodLabels,

  orderStatusLabels,

} from "@/lib/formatters";

import { Eye, ChevronLeft, ChevronRight, Search, PackageOpen } from "lucide-react";

import { usePedidos } from "@/hooks/usePedidos";



const allStatuses: OrderStatus[] = [

  "Pending",

  "PaymentPending",

  "Paid",

  "Processing",

  "Shipped",

  "Delivered",

  "Canceled",

];



const allPaymentMethods: PaymentMethod[] = [

  "Pix",

  "CreditCard",

  "DebitCard",

  "PayOnDelivery",

];



const ITEMS_PER_PAGE = 20;



export default function PedidosTable() {

  const { data: pedidos, isLoading, isError } = usePedidos();

  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);

  const [page, setPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const [searchQuery, setSearchQuery] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [dateFrom, setDateFrom] = useState("");

  const [dateTo, setDateTo] = useState("");



  const handleSearchChange = useCallback((value: string) => {

    setSearchQuery(value);

    const timeout = setTimeout(() => {

      setDebouncedSearch(value);

      setPage(1);

    }, 300);

    return () => clearTimeout(timeout);

  }, []);



  const filteredPedidos = useMemo(() => {

    if (!pedidos) return [];



    return pedidos

      .filter((p) => {

        if (statusFilter !== "all" && p.statusPedido !== statusFilter) return false;

        if (paymentFilter !== "all" && p.formaPagamento !== paymentFilter) return false;



        if (debouncedSearch) {

          const q = debouncedSearch.toLowerCase();

          if (

            !p.nomeCliente.toLowerCase().includes(q) &&

            !p.telefone.toLowerCase().includes(q)

          ) {

            return false;

          }

        }



        if (dateFrom) {

          const fromDate = new Date(dateFrom);

          if (new Date(p.dataPedido) < fromDate) return false;

        }



        if (dateTo) {

          const toDate = new Date(dateTo);

          toDate.setHours(23, 59, 59, 999);

          if (new Date(p.dataPedido) > toDate) return false;

        }



        return true;

      })

      .sort((a, b) => new Date(b.dataPedido).getTime() - new Date(a.dataPedido).getTime());

  }, [pedidos, statusFilter, paymentFilter, debouncedSearch, dateFrom, dateTo]);



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

        <p className="text-sm">Verifique se a API está online e tente novamente.</p>

      </div>

    );

  }



  return (

    <>

      {/* Filters */}

      <div className="flex flex-wrap gap-3 mb-6">

        <div className="relative">

          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

          <Input

            placeholder="Buscar cliente ou telefone..."

            value={searchQuery}

            onChange={(e) => handleSearchChange(e.target.value)}

            className="pl-8 w-64"

            aria-label="Buscar por nome ou telefone do cliente"

          />

        </div>



        <Select

          value={statusFilter}

          onValueChange={(v) => {

            setStatusFilter(v);

            setPage(1);

          }}

        >

          <SelectTrigger className="w-52" aria-label="Filtrar por status do pedido">

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



        <Select

          value={paymentFilter}

          onValueChange={(v) => {

            setPaymentFilter(v);

            setPage(1);

          }}

        >

          <SelectTrigger className="w-52" aria-label="Filtrar por forma de pagamento">

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



        <Input

          type="date"

          value={dateFrom}

          onChange={(e) => {

            setDateFrom(e.target.value);

            setPage(1);

          }}

          className="w-40"

          aria-label="Data inicial"

        />

        <Input

          type="date"

          value={dateTo}

          onChange={(e) => {

            setDateTo(e.target.value);

            setPage(1);

          }}

          className="w-40"

          aria-label="Data final"

        />

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

                  <TableHead>Status Pedido</TableHead>

                  <TableHead>Status Pagamento</TableHead>

                  <TableHead>Data</TableHead>

                  <TableHead>Ações</TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {paginatedPedidos.map((pedido) => (

                  <TableRow key={pedido.id}>

                    <TableCell className="font-mono text-xs">

                      #{pedido.id}

                    </TableCell>

                    <TableCell>

                      <div>

                        <p className="font-medium text-sm">{pedido.nomeCliente}</p>

                        <p className="text-xs text-muted-foreground">{pedido.telefone}</p>

                      </div>

                    </TableCell>

                    <TableCell className="font-medium">

                      {formatCurrency(pedido.total)}

                    </TableCell>

                    <TableCell className="text-sm">

                      {paymentMethodLabels[pedido.formaPagamento]}

                    </TableCell>

                    <TableCell>

                      <OrderStatusBadge status={pedido.statusPedido} />

                    </TableCell>

                    <TableCell>

                      <PaymentStatusBadge status={pedido.statusPagamento} />

                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">

                      {formatDate(pedido.dataPedido)}

                    </TableCell>

                    <TableCell>

                      <Button

                        variant="ghost"

                        size="sm"

                        onClick={() => openSheet(pedido)}

                        aria-label={`Ver detalhes do pedido ${pedido.id}`}

                      >

                        <Eye className="h-4 w-4 mr-1" />

                        Detalhes

                      </Button>

                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </div>



          {/* Pagination */}

          <div className="flex items-center justify-between mt-4">

            <p className="text-sm text-muted-foreground">

              Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}-

              {Math.min(page * ITEMS_PER_PAGE, filteredPedidos.length)} de{" "}

              {filteredPedidos.length} pedidos

            </p>

            <div className="flex gap-2">

              <Button

                variant="outline"

                size="sm"

                disabled={page <= 1}

                onClick={() => setPage((p) => p - 1)}

                aria-label="Página anterior"

              >

                <ChevronLeft className="h-4 w-4" />

              </Button>

              <span className="flex items-center px-3 text-sm text-muted-foreground">

                {page} / {totalPages}

              </span>

              <Button

                variant="outline"

                size="sm"

                disabled={page >= totalPages}

                onClick={() => setPage((p) => p + 1)}

                aria-label="Próxima página"

              >

                <ChevronRight className="h-4 w-4" />

              </Button>

            </div>

          </div>

        </>

      )}



      <PedidoSheet

        pedido={selectedPedido}

        open={sheetOpen}

        onOpenChange={setSheetOpen}

      />

    </>

  );

}
