
using EstacionamentoApi.Data;
using EstacionamentoApi.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// DbContext - MySQL (Pomelo)
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    var cs = builder.Configuration.GetConnectionString("Default")!;
    opt.UseMySql(cs, ServerVersion.AutoDetect(cs));
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var services = new ServiceCollection();

builder.Services.AddControllers();

var app = builder.Build();

const string CorsPolicy = "Frontend";
builder.Services.AddCors(opt =>
{
    opt.AddPolicy(name: CorsPolicy, policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")  // URL do Vite
            .AllowAnyHeader()
            .AllowAnyMethod();
            // .AllowCredentials(); // só se usar cookies/credenciais
    });
});

app.UseCors(CorsPolicy);  // <-- tem que vir ANTES dos app.MapXxx

app.UseSwagger();
app.UseSwaggerUI();


// seus endpoints: /vagas, /veiculos, etc.
app.Run();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/", () => Results.Redirect("/swagger")).ExcludeFromDescription();

// ====== GRUPO VAGAS ======
var vagas = app.MapGroup("/vagas").WithTags("Vagas");

vagas.MapGet("/", async (AppDbContext db, int skip = 0, int take = 50) =>
{
    var data = await db.Vagas
        .OrderBy(v => v.Numero)
        .Skip(skip).Take(take)
        .ToListAsync();
    return Results.Ok(data);
});

vagas.MapGet("/{id:int}", async (int id, AppDbContext db) =>
{
    var vaga = await db.Vagas.FindAsync(id);
    return vaga is null ? Results.NotFound() : Results.Ok(vaga);
});

vagas.MapPost("/", async (VagaCreateDto dto, AppDbContext db) =>
{
    var numero = dto.Numero?.Trim().ToUpperInvariant();
    if (string.IsNullOrWhiteSpace(numero))
        return Results.BadRequest("Número da vaga é obrigatório.");

    var exists = await db.Vagas.AnyAsync(v => v.Numero == numero);
    if (exists) return Results.Conflict("Já existe uma vaga com esse número.");

    var entity = new Vaga
    {
        Numero = numero!,
        Nivel = dto.Nivel,
        Ativa = dto.Ativa ?? true
    };

    db.Vagas.Add(entity);
    await db.SaveChangesAsync();

    return Results.Created($"/vagas/{entity.Id}", entity);
});

vagas.MapPut("/{id:int}", async (int id, VagaUpdateDto dto, AppDbContext db) =>
{
    var vaga = await db.Vagas.FindAsync(id);
    if (vaga is null) return Results.NotFound();

    if (!string.IsNullOrWhiteSpace(dto.Numero))
    {
        var numero = dto.Numero.Trim().ToUpperInvariant();
        var exists = await db.Vagas.AnyAsync(v => v.Numero == numero && v.Id != id);
        if (exists) return Results.Conflict("Já existe outra vaga com esse número.");
        vaga.Numero = numero;
    }

    if (dto.Nivel is not null) vaga.Nivel = dto.Nivel;
    if (dto.Ativa is bool ativa) vaga.Ativa = ativa;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

vagas.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
{
    var vaga = await db.Vagas.FindAsync(id);
    if (vaga is null) return Results.NotFound();

    db.Vagas.Remove(vaga);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ====== GRUPO VEICULOS ======
var veiculos = app.MapGroup("/veiculos").WithTags("Veículos");

veiculos.MapGet("/", async (AppDbContext db, int skip = 0, int take = 50) =>
{
    var data = await db.Veiculos
        .Include(v => v.Vaga)
        .OrderBy(v => v.Placa)
        .Skip(skip).Take(take)
        .ToListAsync();

    return Results.Ok(data);
});

veiculos.MapGet("/{id:int}", async (int id, AppDbContext db) =>
{
    var veiculo = await db.Veiculos
        .Include(v => v.Vaga)
        .FirstOrDefaultAsync(v => v.Id == id);

    return veiculo is null ? Results.NotFound() : Results.Ok(veiculo);
});

veiculos.MapPost("/", async (VeiculoCreateDto dto, AppDbContext db) =>
{
    var placa = dto.Placa?.Trim().ToUpperInvariant();
    if (string.IsNullOrWhiteSpace(placa))
        return Results.BadRequest("Placa é obrigatória.");

    var placaJaExiste = await db.Veiculos.AnyAsync(v => v.Placa == placa);
    if (placaJaExiste) return Results.Conflict("Já existe veículo com essa placa.");

    if (dto.VagaId is int vagaId)
    {
        var vaga = await db.Vagas.FindAsync(vagaId);
        if (vaga is null) return Results.BadRequest("Vaga informada não existe.");
        if (!vaga.Ativa) return Results.BadRequest("Vaga inativa.");

        var ocupada = await db.Veiculos.AnyAsync(v => v.VagaId == vagaId);
        if (ocupada) return Results.Conflict("Vaga já está ocupada.");
    }

    var entity = new Veiculo
    {
        Placa = placa,
        Modelo = dto.Modelo,
        Cor = dto.Cor,
        Ano = dto.Ano,
        VagaId = dto.VagaId
    };

    db.Veiculos.Add(entity);
    await db.SaveChangesAsync();

    return Results.Created($"/veiculos/{entity.Id}", entity);
});

veiculos.MapPut("/{id:int}", async (int id, VeiculoUpdateDto dto, AppDbContext db) =>
{
    var veiculo = await db.Veiculos.FindAsync(id);
    if (veiculo is null) return Results.NotFound();

    if (!string.IsNullOrWhiteSpace(dto.Placa))
    {
        var novaPlaca = dto.Placa.Trim().ToUpperInvariant();
        var existe = await db.Veiculos.AnyAsync(v => v.Placa == novaPlaca && v.Id != id);
        if (existe) return Results.Conflict("Já existe veículo com essa placa.");
        veiculo.Placa = novaPlaca;
    }

    if (dto.Modelo is not null) veiculo.Modelo = dto.Modelo;
    if (dto.Cor is not null) veiculo.Cor = dto.Cor;
    if (dto.Ano is not null) veiculo.Ano = dto.Ano;

    if (dto.VagaIdHasValue)
    {
        if (dto.VagaId is int vagaId)
        {
            var vaga = await db.Vagas.FindAsync(vagaId);
            if (vaga is null) return Results.BadRequest("Vaga informada não existe.");
            if (!vaga.Ativa) return Results.BadRequest("Vaga inativa.");

            var ocupada = await db.Veiculos.AnyAsync(v => v.VagaId == vagaId && v.Id != id);
            if (ocupada) return Results.Conflict("Vaga já está ocupada.");

            veiculo.VagaId = vagaId;
        }
        else
        {
            veiculo.VagaId = null; // liberar
        }
    }

    await db.SaveChangesAsync();
    return Results.NoContent();
});

veiculos.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
{
    var veiculo = await db.Veiculos.FindAsync(id);
    if (veiculo is null) return Results.NotFound();

    db.Veiculos.Remove(veiculo);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

veiculos.MapPost("/{id:int}/ocupar/{vagaId:int}", async (int id, int vagaId, AppDbContext db) =>
{
    var veiculo = await db.Veiculos.FindAsync(id);
    if (veiculo is null) return Results.NotFound("Veículo não encontrado.");

    var vaga = await db.Vagas.FindAsync(vagaId);
    if (vaga is null) return Results.BadRequest("Vaga não existe.");
    if (!vaga.Ativa) return Results.BadRequest("Vaga inativa.");

    var ocupada = await db.Veiculos.AnyAsync(v => v.VagaId == vagaId && v.Id != id);
    if (ocupada) return Results.Conflict("Vaga já está ocupada.");

    veiculo.VagaId = vagaId;
    await db.SaveChangesAsync();
    return Results.Ok(veiculo);
});

veiculos.MapPost("/{id:int}/liberar", async (int id, AppDbContext db) =>
{
    var veiculo = await db.Veiculos.FindAsync(id);
    if (veiculo is null) return Results.NotFound("Veículo não encontrado.");

    veiculo.VagaId = null;
    await db.SaveChangesAsync();
    return Results.Ok(veiculo);
});

app.Run();

internal interface IOtherService
{
}

// ================= DTOs =================

public record VagaCreateDto(string Numero, string? Nivel, bool? Ativa);
public record VagaUpdateDto(string? Numero, string? Nivel, bool? Ativa);

public record VeiculoCreateDto(string Placa, string? Modelo, string? Cor, int? Ano, int? VagaId);

public class VeiculoUpdateDto
{
    public string? Placa { get; set; }
    public string? Modelo { get; set; }
    public string? Cor { get; set; }
    public int? Ano { get; set; }
    public int? VagaId { get; set; }
    public bool VagaIdHasValue { get; set; }
}
