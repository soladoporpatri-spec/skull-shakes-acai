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

import { isToday, parseISO } from "date-fns";

import Link from "next/link";



export default function DashboardPage() {

  const { data: pedidos, isLoading } = usePedidos();



  const metrics = useMemo(() => {

    if (!pedidos) {

      return {

        todayOrders: 0,

        todayRevenue: 0,

        processing: 0,

        paymentPending: 0,

      };

    }



    const todayPedidos = pedidos.filter((p) => {

      try {

        return isToday(parseISO(p.dataPedido));

      } catch {

        return false;

      }

    });



    const todayRevenue = todayPedidos

      .filter((p) => p.statusPagamento === "Paid")

      .reduce((sum, p) => sum + p.total, 0);



    const processing = pedidos.filter(

      (p) => p.statusPedido === "Processing"

    ).length;



    const paymentPending = pedidos.filter(

      (p) => p.statusPedido === "PaymentPending"

    ).length;



    return {

      todayOrders: todayPedidos.length,

      todayRevenue,

      processing,

      paymentPending,

    };

  }, [pedidos]);



  const recentPedidos = useMemo(() => {

    if (!pedidos) return [];

    return [...pedidos]

      .sort(

        (a, b) =>

          new Date(b.dataPedido).getTime() - new Date(a.dataPedido).getTime()

      )

      .slice(0, 10);

  }, [pedidos]);



  return (

    <div className="space-y-6">

      {/* Metric Cards */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <MetricCard

          title="Pedidos Hoje"

          value={metrics.todayOrders}

          icon={ShoppingBag}

          loading={isLoading}

          description="Total de pedidos do dia"

        />

        <MetricCard

          title="Receita Hoje"

          value={formatCurrency(metrics.todayRevenue)}

          icon={DollarSign}

          loading={isLoading}

          description="Pedidos pagos e a pagar"

        />

        <MetricCard

          title="Em Preparo"

          value={metrics.processing}

          icon={Clock}

          loading={isLoading}

          description="Aguardando preparo"

        />

        <MetricCard

          title="Aguardando Pagamento"

          value={metrics.paymentPending}

          icon={AlertCircle}

          loading={isLoading}

          description="Pedidos a receber"

        />

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

          <Link

            href="/pedidos"

            className="text-sm text-accent hover:text-accent/80 transition-colors"

          >

            Ver todos →

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

                    <TableCell className="font-mono text-xs">

                      #{p.id}

                    </TableCell>

                    <TableCell className="text-sm">{p.nomeCliente}</TableCell>

                    <TableCell className="text-sm font-medium">

                      {formatCurrency(p.total)}

                    </TableCell>

                    <TableCell>

                      <OrderStatusBadge status={p.statusPedido} />

                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">

                      {formatDate(p.dataPedido)}

                    </TableCell>

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
