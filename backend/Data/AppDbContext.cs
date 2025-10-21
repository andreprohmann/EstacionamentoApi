
using EstacionamentoApi.Models;
using Microsoft.EntityFrameworkCore;

namespace EstacionamentoApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Veiculo> Veiculos => Set<Veiculo>();
    public DbSet<Vaga> Vagas => Set<Vaga>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Unicidade
        modelBuilder.Entity<Veiculo>()
            .HasIndex(v => v.Placa)
            .IsUnique();

        modelBuilder.Entity<Vaga>()
            .HasIndex(v => v.Numero)
            .IsUnique();

        // Relacionamento N:1 (opcional)
        modelBuilder.Entity<Veiculo>()
            .HasOne(v => v.Vaga)
            .WithMany(g => g.Veiculos)
            .HasForeignKey(v => v.VagaId)
            .OnDelete(DeleteBehavior.SetNull);

        base.OnModelCreating(modelBuilder);
    }
}
