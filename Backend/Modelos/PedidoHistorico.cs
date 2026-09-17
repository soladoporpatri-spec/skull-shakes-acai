using System.ComponentModel.DataAnnotations;
using SkullShakes.Api.Enums;

namespace SkullShakes.Api.Modelos;

public class PedidoHistorico
{
    [Key]
    public int Id { get; set; }
    public int PedidoId { get; set; }
    public Pedido Pedido { get; set; } = null!;
    
    public string Mensagem { get; set; } = string.Empty;
    public string Responsavel { get; set; } = string.Empty; // e.g., "Sistema", "MercadoPago", "Admin"
    public DateTime DataAlteracao { get; set; } = DateTime.UtcNow;
    
    // Optional status changes context
    public string? StatusAnterior { get; set; }
    public string? StatusNovo { get; set; }
}
