using SkullShakes.Api.DTOs;

namespace SkullShakes.Api.Servicos;

public class MercadoPagoServico
{
    // Aqui vai a integração real HTTP com a API do Mercado Pago
    public async Task<PixResponse> GerarPixAsync(decimal valor, Guid pedidoId)
    {
        // Mock momentâneo
        await Task.Delay(500); 
        return new PixResponse 
        { 
            QrCodeBase64 = "MOCK_QR_CODE", 
            CopiaECola = "00020101021126360014br.gov.bcb.pix...", 
            TransacaoId = Guid.NewGuid().ToString() 
        };
    }
}
