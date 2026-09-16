export type OrderStatus =

  | "Pending"

  | "PaymentPending"

  | "Paid"

  | "Processing"

  | "Shipped"

  | "Delivered"

  | "Canceled";



export type PaymentStatus =

  | "Pending"

  | "Processing"

  | "Paid"

  | "Failed"

  | "Canceled"

  | "Expired"

  | "Refunded";



export type PaymentMethod =

  | "Pix"

  | "CreditCard"

  | "DebitCard"

  | "PayOnDelivery";



export interface ItemPedido {

  quantidade: number;

  precoUnitario: number;

  produto: string;

}



export interface Pedido {

  id: number;

  nomeCliente: string;

  telefone: string;

  endereco: string;

  dataPedido: string;

  dataPagamento: string | null;

  statusPedido: OrderStatus;

  statusPagamento: PaymentStatus;

  formaPagamento: PaymentMethod;

  subtotal: number;

  deliveryFee: number;

  discount: number;

  total: number;

  pagamentoExternoId: string | null;

  itens: ItemPedido[];

}



export interface Produto {

  id: number;

  nome: string;

  descricao: string;

  precoBase: number;

  urlImagem: string;

  disponivel: boolean;

}



export interface AuthTokens {

  accessToken: string;

  accessTokenExpiry: string;

  refreshToken: string;

  refreshTokenExpiry: string;

}



export interface LoginCredentials {

  username: string;

  password: string;

}
