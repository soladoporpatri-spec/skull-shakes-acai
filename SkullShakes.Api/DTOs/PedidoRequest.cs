namespace SkullShakes.Api.DTOs;

public class PedidoRequest
{
    public string NomeCliente { get; set; } = string.Empty;
    public string TelefoneCliente { get; set; } = string.Empty;
    public string Observacoes { get; set; } = string.Empty;
    
    // Endereço
    public string Rua { get; set; } = string.Empty;
    public string Numero { get; set; } = string.Empty;
    public string Complemento { get; set; } = string.Empty;
    public string Bairro { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string Cep { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    
    // Pagamento
    public string MetodoPagamento { get; set; } = string.Empty; // Pix, Cartao, Dinheiro
    public decimal? TrocoPara { get; set; }
    
    public decimal TaxaEntregaCalculada { get; set; }
    
    public List<ItemPedidoRequest> Itens { get; set; } = new();
}

public class ItemPedidoRequest
{
    public Guid ProdutoId { get; set; }
    public int Quantidade { get; set; }
    public List<string> AdicionaisNomes { get; set; } = new();
}
