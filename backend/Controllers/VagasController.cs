using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace EstacionamentoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VagasController : ControllerBase
    {
        private static readonly List<Vaga> _vagas = new();
        private static int _idSeq = 1;

        // GET /api/Vagas
        [HttpGet]
        public IActionResult Get() => Ok(_vagas);

        // GET /api/Vagas/{id}
        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var vaga = _vagas.FirstOrDefault(v => v.Id == id);
            return vaga is null ? NotFound() : Ok(vaga);
        }

        // POST /api/Vagas
        [HttpPost]
        public IActionResult Post([FromBody] CriarVagaDto dto)
        {
            if (dto is null)
                return BadRequest("JSON inválido ou body vazio.");

            if (string.IsNullOrWhiteSpace(dto.Placa))
                return BadRequest("Placa é obrigatória.");
            if (dto.NumeroVaga <= 0)
                return BadRequest("Número da vaga deve ser maior que zero.");

            var vaga = new Vaga
            {
                Id = _idSeq++,
                Placa = dto.Placa.Trim(),
                NumeroVaga = dto.NumeroVaga,
                Ocupada = dto.Ocupada
            };

            _vagas.Add(vaga);

            return CreatedAtAction(nameof(GetById), new { id = vaga.Id }, vaga);
        }

        // PUT /api/Vagas/{id}
        [HttpPut("{id:int}")]
        public IActionResult Put(int id, [FromBody] AtualizarVagaDto dto)
        {
            if (dto is null)
                return BadRequest("JSON inválido ou body vazio.");

            var vaga = _vagas.FirstOrDefault(v => v.Id == id);
            if (vaga is null) return NotFound();

            if (!string.IsNullOrWhiteSpace(dto.Placa))
                vaga.Placa = dto.Placa.Trim();

            if (dto.NumeroVaga.HasValue)
            {
                if (dto.NumeroVaga.Value <= 0)
                    return BadRequest("Número da vaga deve ser maior que zero.");
                vaga.NumeroVaga = dto.NumeroVaga.Value;
            }

            if (dto.Ocupada.HasValue)
                vaga.Ocupada = dto.Ocupada.Value;

            return Ok(vaga);
        }

        // DELETE /api/Vagas/{id}
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var vaga = _vagas.FirstOrDefault(v => v.Id == id);
            if (vaga is null) return NotFound();

            _vagas.Remove(vaga);
            return NoContent();
        }
    }

    public class Vaga
    {
        public int Id { get; set; }
        [Required]
        public string Placa { get; set; } = string.Empty;
        [Range(1, int.MaxValue)]
        public int NumeroVaga { get; set; }
        public bool Ocupada { get; set; }
    }

    public record CriarVagaDto(string Placa, int NumeroVaga, bool Ocupada);

    public class AtualizarVagaDto
    {
        public string? Placa { get; set; }
        public int? NumeroVaga { get; set; }
        public bool? Ocupada { get; set; }
    }
}
