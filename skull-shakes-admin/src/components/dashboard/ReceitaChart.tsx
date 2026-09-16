"use client";



import React, { useMemo } from "react";

import {

  BarChart,

  Bar,

  XAxis,

  YAxis,

  CartesianGrid,

  Tooltip,

  ResponsiveContainer,

} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { Pedido } from "@/types";

import { format, subDays, startOfDay, parseISO } from "date-fns";

import { ptBR } from "date-fns/locale";

import { formatCurrency } from "@/lib/formatters";



interface ReceitaChartProps {

  pedidos: Pedido[];

  loading?: boolean;

}



export default function ReceitaChart({ pedidos, loading }: ReceitaChartProps) {

  const data = useMemo(() => {

    const days = Array.from({ length: 7 }, (_, i) => {

      const date = subDays(new Date(), 6 - i);

      return {

        date: format(startOfDay(date), "yyyy-MM-dd"),

        label: format(date, "dd/MM", { locale: ptBR }),

        receita: 0,

      };

    });



    pedidos.forEach((p) => {

      if (p.statusPagamento !== "Paid") return;

      const pDate = format(startOfDay(parseISO(p.dataPedido)), "yyyy-MM-dd");

      const day = days.find((d) => d.date === pDate);

      if (day) {

        day.receita += p.total;

      }

    });



    return days;

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



  return (

    <Card>

      <CardHeader>

        <CardTitle className="text-base">Receita dos últimos 7 dias</CardTitle>

      </CardHeader>

      <CardContent>

        <ResponsiveContainer width="100%" height={280}>

          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />

            <XAxis dataKey="label" tick={{ fill: "#a1a1aa", fontSize: 12 }} />

            <YAxis

              tick={{ fill: "#a1a1aa", fontSize: 12 }}

              tickFormatter={(v: number) => `R$${v}`}

            />

            <Tooltip

              contentStyle={{

                backgroundColor: "#111111",

                border: "1px solid #1f1f1f",

                borderRadius: "8px",

                color: "#f5f5f5",

              }}

              formatter={(value: number) => [formatCurrency(value), "Receita"]}

              labelStyle={{ color: "#a1a1aa" }}

            />

            <Bar dataKey="receita" fill="#7c3aed" radius={[4, 4, 0, 0]} />

          </BarChart>

        </ResponsiveContainer>

      </CardContent>

    </Card>

  );

}
