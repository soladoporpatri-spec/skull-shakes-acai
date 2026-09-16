namespace SkullShakes.Api.DTOs;

public class PixResponse
{
    public string QrCodeCopiaECola { get; set; } = string.Empty;
    public string QrCodeBase64 { get; set; } = string.Empty;
    public long TransacaoId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? ExpiresAt { get; set; }
}

public class PedidoCreatedResponse
{
    public int PedidoId { get; set; }
    public string FormaPagamento { get; set; } = string.Empty;
    public string StatusPagamento { get; set; } = string.Empty;
    public string? Mensagem { get; set; }
    // For PIX payments
    public PixResponse? Pix { get; set; }
    // For Card payments - redirect URL to Mercado Pago hosted checkout
    public string? CheckoutUrl { get; set; }
    public string? PreferenceId { get; set; }
}
