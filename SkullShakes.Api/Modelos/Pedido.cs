namespace SkullShakes.Api.Modelos;

public class Pedido
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Aguardando"; // Aguardando, Preparando, SaiuParaEntrega, Concluido, Cancelado
    public string NomeCliente { get; set; } = string.Empty;
    public string TelefoneCliente { get; set; } = string.Empty;
    public string Observacoes { get; set; } = string.Empty;
    
    // Valores
    public decimal SubTotal { get; set; }
    public decimal TaxaEntrega { get; set; }
    public decimal Total { get; set; }
    
    // Endereço Integrado
    public string Rua { get; set; } = string.Empty;
    public string Numero { get; set; } = string.Empty;
    public string Complemento { get; set; } = string.Empty;
    public string Bairro { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string Cep { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    
    // Pagamento Integrado
    public string MetodoPagamento { get; set; } = string.Empty; // Pix, Cartao, Dinheiro
    public decimal? TrocoPara { get; set; }
    public bool Pago { get; set; } = false;
    public string IdTransacaoExterna { get; set; } = string.Empty;
    
    // Relacionamento
    public List<ItemPedido> Itens { get; set; } = new();
}
