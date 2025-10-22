// AppDbContext.cs
using Microsoft.EntityFrameworkCore; // <- EF Core (obrigatório)
using EstacionamentoApi.Domain;     // <- se seus modelos estiverem em outro namespace

namespace EstacionamentoApi.Data
{
    public class AppDbContext : DbContext // <- herda do EF Core
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // DbSets
        public DbSet<Vaga> Vagas => Set<Vaga>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Vaga>(entity =>
            {
                entity.HasKey(x => x.Id);
                entity.Property(x => x.Placa)
                    .IsRequired()
                    .HasMaxLength(10);
                entity.Property(x => x.NumeroVaga).IsRequired();
                entity.Property(x => x.Ocupada).IsRequired();
            });
        }
    }
}

// Se quiser, mantenha seu modelo aqui ou em outro arquivo/namespace
namespace EstacionamentoApi.Domain
{
    public class Vaga
    {
        public int Id { get; set; }
        public string Placa { get; set; } = string.Empty;
        public int NumeroVaga { get; set; }
        public bool Ocupada { get; set; }
    }
}