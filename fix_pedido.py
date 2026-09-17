content = '''using SkullShakes.Api.Enums;

namespace SkullShakes.Api.Modelos;

public class Pedido
{
    public int Id { get; set; }

    public string NomeCliente { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public string Observacoes { get; set; } = string.Empty;

    public DateTime DataPedido { get; set; } = DateTime.UtcNow;
    public DateTime? DataPagamento { get; set; }

    public OrderStatus StatusPedido { get; set; } = OrderStatus.Pending;
    public PaymentStatus StatusPagamento { get; set; } = PaymentStatus.Pending;
    public PaymentMethod FormaPagamento { get; set; }
    public PaymentModality ModalidadePagamento { get; set; }

    public string? PagamentoExternoId { get; set; } // ID from Mercado Pago
    public string? IdempotencyKey { get; set; } // To prevent duplicate charges

    public List<ItemPedido> Itens { get; set; } = new();

    // Stored values - locked at order creation time, never recomputed
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal DeliveryFee { get; set; }
    public decimal Total { get; set; }
}
'''
with open('Backend/Modelos/Pedido.cs', 'w', encoding='utf-8') as f:
    f.write(content)
