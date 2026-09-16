namespace SkullShakes.Api.Servicos;

public class WhatsAppServico
{
    public async Task EnviarMensagemLojaAsync(string mensagem)
    {
        // Aqui se conecta com a API (Ex: Evolution API, WWebJS, Z-API)
        // Por enquanto logamos no console para depuração
        Console.WriteLine($"[WHATSAPP PARA LOJA]: {mensagem}");
        await Task.CompletedTask;
    }

    public async Task EnviarMensagemClienteAsync(string telefone, string mensagem)
    {
        Console.WriteLine($"[WHATSAPP PARA CLIENTE - {telefone}]: {mensagem}");
        await Task.CompletedTask;
    }
}
