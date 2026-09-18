import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { OrderStatus, PaymentStatus, PaymentMethod } from "@/types";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  } catch {
    return dateString;
  }
}

export function formatDateShort(dateString: string): string {
  try {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return dateString;
  }
}

export function formatDayMonth(dateString: string): string {
  try {
    return format(parseISO(dateString), "dd/MM", { locale: ptBR });
  } catch {
    return dateString;
  }
}

export const orderStatusLabels: Record<OrderStatus, string> = {
  Pending: "Pendente",
  PaymentPending: "Aguardando Pagamento",
  Paid: "Pago",
  Processing: "Em Preparo",
  Shipped: "Enviado",
  Delivered: "Entregue",
  Canceled: "Cancelado",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  Pending: "Pendente",
  Processing: "Processando",
  Paid: "Pago",
  Failed: "Falhou",
  Canceled: "Cancelado",
  Expired: "Expirado",
  Refunded: "Reembolsado",
};

export const paymentMethodLabels: Record<string, string> = {
  Pix: "PIX",
  CreditCard: "Cartão Crédito",
  DebitCard: "Cartão Débito",
  Cash: "Dinheiro",
  PayOnDelivery: "Pagar na Entrega",
};

export function getPaymentMethodLabel(method: string): string {
  return paymentMethodLabels[method] || method || "—";
}

export function getModalidadeLabel(modalidade?: string): { label: string; icon: "delivery" | "pickup" } {
  if (modalidade === "OnDelivery") {
    return { label: "Entrega", icon: "delivery" };
  }
  return { label: "Retirada", icon: "pickup" };
}
