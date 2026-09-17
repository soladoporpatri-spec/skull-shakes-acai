namespace SkullShakes.Api.Modelos;

public class Produto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal PrecoBase { get; set; }
    public bool Disponivel { get; set; } = true;
    public bool IsAtivo { get; set; } = true;
    public string Descricao { get; set; } = string.Empty;
    public int TamanhoMl { get; set; }
    public bool Personalizavel { get; set; }
    public string Categoria { get; set; } = string.Empty;
    public string ImagemUrl { get; set; } = string.Empty;
}
