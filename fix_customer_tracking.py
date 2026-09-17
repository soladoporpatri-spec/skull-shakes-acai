# -*- coding: utf-8 -*-
import re

with open('web/src/app/pedido/[id]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace interface
content = content.replace(
'''interface OrderData {
  id: number;
  nomeCliente: string;
  total: number;
  statusPedido: string;
  statusPagamento: string;
  formaPagamento: string;
  dataCriacao: string;
}''',
'''interface OrderData {
  id: number;
  nomeCliente: string;
  total: number;
  statusPedido: string;
  statusPagamento: string;
  formaPagamento: string;
  modalidadePagamento: string;
  dataCriacao: string;
}'''
)

# Replace logic block
content = content.replace(
'''  let currentStep = 0;
  
  if (order.statusPagamento === 'Paid' || order.formaPagamento === 'PayOnDelivery') {
    currentStep = 1; // Pagamento aprovado (ou pagar na entrega)
  }

  if (order.statusPedido === 'Processing' && currentStep >= 1) {
    currentStep = 2; // Preparação
  }
  if (order.statusPedido === 'OutForDelivery') {
    currentStep = 3; // Entrega
  }
  if (order.statusPedido === 'Delivered') {
    currentStep = 4; // Entregue
  }

  const steps = [
    { label: 'Aguardando pagamento', icon: Clock },
    { label: order.formaPagamento === 'PayOnDelivery' ? 'Pagar na Entrega' : 'Pagamento aprovado', icon: CheckCircle2 },
    { label: 'Pedido em preparação', icon: Package },
    { label: 'Enviado para entrega', icon: Truck },
    { label: 'Entregue', icon: CheckCircle2 },
  ];''',
'''  let currentStep = 0;
  
  if (order.statusPagamento === 'Paid' || order.modalidadePagamento === 'OnDelivery') {
    currentStep = 1; // Pagamento aprovado (ou pagar na entrega)
  }

  if (order.statusPedido === 'Processing' && currentStep >= 1) {
    currentStep = 2; // Preparação
  }
  if (order.statusPedido === 'OutForDelivery') {
    currentStep = 3; // Entrega
  }
  if (order.statusPedido === 'Delivered') {
    currentStep = 4; // Entregue
  }

  const steps = [
    { label: order.modalidadePagamento === 'OnDelivery' ? 'Pagamento na entrega' : 'Aguardando pagamento', icon: Clock },
    { label: order.modalidadePagamento === 'OnDelivery' ? 'Pedido confirmado' : 'Pagamento aprovado', icon: CheckCircle2 },
    { label: 'Pedido em preparação', icon: Package },
    { label: 'Enviado para entrega', icon: Truck },
    { label: 'Entregue', icon: CheckCircle2 },
  ];'''
)

# Replace string match in UI
content = content.replace(
    "order.formaPagamento === 'PayOnDelivery' ? 'Na Entrega' : 'Cartão'",
    "order.formaPagamento === 'Cash' ? 'Dinheiro' : 'Cartão'"
)

with open('web/src/app/pedido/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
