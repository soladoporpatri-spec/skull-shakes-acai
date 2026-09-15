namespace SkullShakes.Api.Servicos;

public class WhatsAppServico
{
    // Integração com a sua ponte (WhatsAppBridge) da Barbearia
    public async Task NotificarNovaVendaAsync(string mensagem)
    {
        // Mock momentâneo
        await Task.Delay(200);
        Console.WriteLine($"[WhatsApp] Enviado: {mensagem}");
    }
}
