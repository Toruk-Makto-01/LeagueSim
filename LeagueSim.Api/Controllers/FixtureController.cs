using LeagueSim.Api.Models;
using LeagueSim.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LeagueSim.Api.Controllers
{

    [ApiController]
    [Route("api/Fixture")]
    public class FixtureController : ControllerBase
    {
        private readonly FixtureService _service;

        public FixtureController(FixtureService service)
        {
            _service = service;
        }

        [HttpPost("{leagueId}")]
        public IActionResult GenerateFixture(int leagueId)
        {
            _service.GenerateFixture(leagueId);
            return Ok("Fikstür oluşturuldu");
        }
    }
}
