using LeagueSim.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LeagueSim.Api.Controllers
{
    [ApiController]
    [Route("api/Simulation")]
    public class SimulationController : ControllerBase
    {
        private readonly SimulationService _service;

        public SimulationController(SimulationService service)
        {
            _service = service;
        }

        // Belirli bir haftayı simüle eder
        [HttpPost("{weekId}")]
        public IActionResult PlayWeek(int weekId)
        {
            _service.PlayWeek(weekId);
            return Ok("Hafta oynatıldı.");
        }

        // İlgili ligin tüm sezonunu tek seferde simüle eder
        [HttpPost("play-season/{leagueId}")]
        public IActionResult PlaySeason(int leagueId)
        {
            _service.PlayAllSeason(leagueId);
            return Ok("Tüm sezon başarıyla oynatıldı ve şampiyon belirlendi!");
        }
    }
}