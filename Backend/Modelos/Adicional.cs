namespace SkullShakes.Api.Modelos;

public class Adicional
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal PrecoBase { get; set; }
    public bool Disponivel { get; set; } = true;
    public string Categoria { get; set; } = string.Empty;
}
