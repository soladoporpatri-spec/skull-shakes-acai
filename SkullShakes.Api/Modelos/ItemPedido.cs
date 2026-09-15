namespace SkullShakes.Api.Modelos;

public class ItemPedido
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PedidoId { get; set; }
    
    public Guid ProdutoId { get; set; }
    public string NomeProduto { get; set; } = string.Empty;
    
    public int Quantidade { get; set; }
    public decimal PrecoUnitario { get; set; } // Preço na hora da compra
    
    // Adicionais escolhidos salvos como string (JSON ou delimitado) para histórico
    public string AdicionaisSelecionados { get; set; } = string.Empty; 
}
