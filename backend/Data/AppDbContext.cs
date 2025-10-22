using Microsoft.EntityFrameworkCore;
using EstacionamentoApi.Models;

namespace EstacionamentoApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Vaga> Vagas { get; set; }
        public DbSet<Veiculo> Veiculos { get; set; }
    }
}
