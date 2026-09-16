namespace SkullShakes.Api.Servicos;

public interface IDeliveryCalculator
{
    Task<decimal> CalcularTaxaAsync(string cep);
}

// APROXIMACAO: usa prefixo de CEP, nao distancia geografica exata.
// Para producao, substituir por API de geocodificacao real.
public class CepPrefixDeliveryCalculator : IDeliveryCalculator
{
    private static readonly Dictionary<string, decimal> Taxas = new()
    {
        { " 75", 5.00m },
        { "72", 8.00m },
        { "74", 8.00m },
        { "73", 10.00m },
        { "76", 7.00m },
    };

    private const decimal TaxaPadrao = 12.00m;

    public Task<decimal> CalcularTaxaAsync(string cep)
    {
        var cepLimpo = new string(cep.Where(char.IsDigit).ToArray());
        if (cepLimpo.Length < 5)
            return Task.FromResult(TaxaPadrao);

        var prefixo2 = cepLimpo[..2];
        if (Taxas.TryGetValue(prefixo2, out var taxa))
            return Task.FromResult(taxa);

        return Task.FromResult(TaxaPadrao);
    }
}
