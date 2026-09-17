using System.ComponentModel.DataAnnotations;

namespace SkullShakes.Api.Modelos;

public class StoreSettings
{
    [Key]
    public int Id { get; set; }
    public bool IsAberta { get; set; }
}
