namespace EstacionamentoApi.Models;

public class Veiculo
{
    public int Id { get; set; }
    public string Placa { get; set; } = default!;
    public string? Modelo { get; set; }
    public string? Cor { get; set; }
    public int? Ano { get; set; }

    public int? VagaId { get; set; }
    public Vaga? Vaga { get; set; }
}
