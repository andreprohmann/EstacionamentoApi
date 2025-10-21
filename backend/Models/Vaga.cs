
namespace EstacionamentoApi.Models;

public class Vaga
{
    public int Id { get; set; }
    public string Numero { get; set; } = default!; // Ex: A-12
    public string? Nivel { get; set; }
    public bool Ativa { get; set; } = true;

    public ICollection<Veiculo> Veiculos { get; set; } = new List<Veiculo>();
}
