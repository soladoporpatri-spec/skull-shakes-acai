namespace SkullShakes.Api.Modelos;

public class ItemPedido
{
     public int Id { get; set; }

     public int ProdutoId { get; set; }

     public Produto Produto { get; set; } = null!;

     public int Quantidade { get; set; }

     public decimal PrecoUnitario { get; set; }

     public List<Adicional> Adicionais { get; set; } = new();

     public decimal Subtotal => PrecoUnitario * Quantidade;
}
