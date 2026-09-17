namespace SkullShakes.Api.DTOs;

public class PedidoRequest
{
    public string NomeCliente { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public string Cep { get; set; } = string.Empty;
    public string Observacoes { get; set; } = string.Empty;
    public string FormaPagamento { get; set; } = string.Empty;
    public string ModalidadePagamento { get; set; } = "Online";
    public string? IdempotencyKey { get; set; }
    public decimal? DeliveryFee { get; set; }
    public List<ItemPedidoRequest> Itens { get; set; } = new();
}

public class ItemPedidoRequest
{
    public int ProdutoId { get; set; }
    public int Quantidade { get; set; }
    public List<int> AdicionaisIds { get; set; } = new();
}
