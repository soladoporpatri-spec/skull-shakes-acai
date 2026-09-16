using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using SkullShakes.Api.DTOs;

namespace SkullShakes.Api.Servicos;

public class MercadoPagoServico
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;
    private readonly ILogger<MercadoPagoServico> _logger;

    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    public MercadoPagoServico(HttpClient httpClient, IConfiguration config, ILogger<MercadoPagoServico> logger)
    {
        _httpClient = httpClient;
        _config = config;
        _logger = logger;
    }

    private string GetToken() =>
        _config["MERCADOPAGO_ACCESS_TOKEN"]
            ?? throw new InvalidOperationException("MERCADOPAGO_ACCESS_TOKEN env var not configured.");

    public async Task<PixResponse> GerarPixAsync(int pedidoId, decimal valorTotal, string nomeCliente)
    {
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetToken());

        var body = new
        {
            transaction_amount = valorTotal,
            payment_method_id = "pix",
            payer = new { email = "cliente@skullshakes.com.br", first_name = nomeCliente },
            external_reference = pedidoId.ToString(),
            description = $"Pedido #{pedidoId} - Skull Shakes"
        };

        var content = new StringContent(JsonSerializer.Serialize(body, JsonOpts), Encoding.UTF8, "application/json");
        content.Headers.Add("X-Idempotency-Key", $"pix-pedido-{pedidoId}");

        var response = await _httpClient.PostAsync("https://api.mercadopago.com/v1/payments", content);
        var rawBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("MP PIX creation failed. Status:{Status}", response.StatusCode);
            throw new Exception($"Falha ao gerar PIX. Status: {response.StatusCode}");
        }

        using var doc = JsonDocument.Parse(rawBody);
        var root = doc.RootElement;

        var qrCode = root.GetProperty("point_of_interaction")
            .GetProperty("transaction_data").GetProperty("qr_code").GetString() ?? "";
        var qrBase64 = root.GetProperty("point_of_interaction")
            .GetProperty("transaction_data").GetProperty("qr_code_base64").GetString() ?? "";
        var paymentId = root.GetProperty("id").GetInt64();
        var status = root.GetProperty("status").GetString() ?? "pending";

        DateTime? expiresAt = null;
        if (root.TryGetProperty("date_of_expiration", out var expProp) && expProp.ValueKind != JsonValueKind.Null)
            expiresAt = expProp.GetDateTime();

        _logger.LogInformation("PIX created for Pedido #{PedidoId}. PaymentId:{PaymentId}", pedidoId, paymentId);

        return new PixResponse { QrCodeCopiaECola = qrCode, QrCodeBase64 = qrBase64, TransacaoId = paymentId, Status = status, ExpiresAt = expiresAt };
    }

    public async Task<(string CheckoutUrl, string PreferenceId)> GerarPreferenciaCartaoAsync(
        int pedidoId, decimal valorTotal, string descricao, string successUrl, string failureUrl)
    {
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetToken());

        var body = new
        {
            items = new[] { new { title = descricao, quantity = 1, unit_price = valorTotal, currency_id = "BRL" } },
            external_reference = pedidoId.ToString(),
            back_urls = new { success = successUrl, failure = failureUrl, pending = successUrl },
            auto_return = "approved"
        };

        var content = new StringContent(JsonSerializer.Serialize(body, JsonOpts), Encoding.UTF8, "application/json");
        content.Headers.Add("X-Idempotency-Key", $"cartao-pedido-{pedidoId}");

        var response = await _httpClient.PostAsync("https://api.mercadopago.com/checkout/preferences", content);
        var rawBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("MP Preference creation failed. Status:{Status}", response.StatusCode);
            throw new Exception($"Falha ao criar preferencia. Status: {response.StatusCode}");
        }

        using var doc = JsonDocument.Parse(rawBody);
        var root = doc.RootElement;
        var checkoutUrl = root.GetProperty("init_point").GetString() ?? "";
        var prefId = root.GetProperty("id").GetString() ?? "";

        _logger.LogInformation("Preference created for Pedido #{PedidoId}", pedidoId);
        return (checkoutUrl, prefId);
    }

    public async Task<(string Status, decimal Amount, string ExternalReference)> ConsultarPagamentoAsync(long paymentId)
    {
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetToken());

        var response = await _httpClient.GetAsync($"https://api.mercadopago.com/v1/payments/{paymentId}");
        var rawBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Failed to fetch payment {PaymentId} from MP.", paymentId);
            throw new Exception($"Falha ao consultar pagamento {paymentId}");
        }

        using var doc = JsonDocument.Parse(rawBody);
        var root = doc.RootElement;
        var status = root.GetProperty("status").GetString() ?? "unknown";
        var amount = root.GetProperty("transaction_amount").GetDecimal();
        var extRef = root.TryGetProperty("external_reference", out var extProp) ? (extProp.GetString() ?? "") : "";

        return (status, amount, extRef);
    }
}
