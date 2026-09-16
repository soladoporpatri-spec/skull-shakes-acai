import React from "react";

import { Badge } from "@/components/ui/badge";

import { OrderStatus, PaymentStatus } from "@/types";

import { orderStatusLabels, paymentStatusLabels } from "@/lib/formatters";



const orderStatusVariant: Record<OrderStatus, "gray" | "warning" | "info" | "purple" | "orange" | "success" | "destructive"> = {

  Pending: "gray",

  PaymentPending: "warning",

  Paid: "info",

  Processing: "purple",

  Shipped: "orange",

  Delivered: "success",

  Canceled: "destructive",

};



const paymentStatusVariant: Record<PaymentStatus, "gray" | "warning" | "info" | "purple" | "orange" | "success" | "destructive"> = {

  Pending: "gray",

  Processing: "warning",

  Paid: "success",

  Failed: "destructive",

  Canceled: "destructive",

  Expired: "gray",

  Refunded: "info",

};



export function OrderStatusBadge({ status }: { status: OrderStatus }) {

  return (

    <Badge variant={orderStatusVariant[status]}>

      {orderStatusLabels[status]}

    </Badge>

  );

}



export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {

  return (

    <Badge variant={paymentStatusVariant[status]}>

      {paymentStatusLabels[status]}

    </Badge>

  );

}
