import React from "react";

import { Card, CardContent } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { LucideIcon } from "lucide-react";



interface MetricCardProps {

  title: string;

  value: string | number;

  icon: LucideIcon;

  description?: string;

  loading?: boolean;

}



export default function MetricCard({

  title,

  value,

  icon: Icon,

  description,

  loading = false,

}: MetricCardProps) {

  if (loading) {

    return (

      <Card>

        <CardContent className="p-6">

          <Skeleton className="h-4 w-24 mb-3" />

          <Skeleton className="h-8 w-32 mb-1" />

          <Skeleton className="h-3 w-20" />

        </CardContent>

      </Card>

    );

  }



  return (

    <Card>

      <CardContent className="p-6">

        <div className="flex items-center justify-between mb-3">

          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <Icon className="h-5 w-5 text-muted-foreground" />

        </div>

        <p className="text-2xl font-bold text-foreground">{value}</p>

        {description && (

          <p className="text-xs text-muted-foreground mt-1">{description}</p>

        )}

      </CardContent>

    </Card>

  );

}
