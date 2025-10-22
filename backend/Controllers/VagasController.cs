using Microsoft.AspNetCore.Mvc;
using EstacionamentoApi.Data;
using EstacionamentoApi.Models;

namespace EstacionamentoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VagasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VagasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get() => Ok(_context.Vagas.ToList());

        [HttpPost]
        public async Task<IActionResult> Post(Vaga vaga)
        {
            _context.Vagas.Add(vaga);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = vaga.Id }, vaga);
        }
    }
}
