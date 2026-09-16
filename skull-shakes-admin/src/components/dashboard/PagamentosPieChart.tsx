"use client";



import React, { useMemo } from "react";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { Pedido, PaymentMethod } from "@/types";

import { paymentMethodLabels } from "@/lib/formatters";



const COLORS: Record<PaymentMethod, string> = {

  Pix: "#22c55e",

  CreditCard: "#3b82f6",

  DebitCard: "#f59e0b",

  PayOnDelivery: "#ef4444",

};



interface PagamentosPieChartProps {

  pedidos: Pedido[];

  loading?: boolean;

}



export default function PagamentosPieChart({

  pedidos,

  loading,

}: PagamentosPieChartProps) {

  const data = useMemo(() => {

    const counts: Record<string, number> = {};

    pedidos.forEach((p) => {

      const method = p.formaPagamento;

      counts[method] = (counts[method] || 0) + 1;

    });



    return Object.entries(counts).map(([method, count]) => ({

      name: paymentMethodLabels[method as PaymentMethod],

      value: count,

      method: method as PaymentMethod,

    }));

  }, [pedidos]);



  if (loading) {

    return (

      <Card>

        <CardHeader>

          <Skeleton className="h-5 w-48" />

        </CardHeader>

        <CardContent>

          <Skeleton className="h-64 w-full" />

        </CardContent>

      </Card>

    );

  }



  if (data.length === 0) {

    return (

      <Card>

        <CardHeader>

          <CardTitle className="text-base">Pedidos por Forma de Pagamento</CardTitle>

        </CardHeader>

        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">

          Sem dados disponíveis

        </CardContent>

      </Card>

    );

  }



  return (

    <Card>

      <CardHeader>

        <CardTitle className="text-base">Pedidos por Forma de Pagamento</CardTitle>

      </CardHeader>

      <CardContent>

        <ResponsiveContainer width="100%" height={280}>

          <PieChart>

            <Pie

              data={data}

              cx="50%"

              cy="50%"

              innerRadius={60}

              outerRadius={100}

              paddingAngle={3}

              dataKey="value"

            >

              {data.map((entry) => (

                <Cell key={entry.method} fill={COLORS[entry.method]} />

              ))}

            </Pie>

            <Tooltip

              contentStyle={{

                backgroundColor: "#111111",

                border: "1px solid #1f1f1f",

                borderRadius: "8px",

                color: "#f5f5f5",

              }}

            />

            <Legend

              wrapperStyle={{ color: "#a1a1aa", fontSize: "12px" }}

            />

          </PieChart>

        </ResponsiveContainer>

      </CardContent>

    </Card>

  );

}
