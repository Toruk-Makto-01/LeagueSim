using LeagueSim.Api.Models;
using LeagueSim.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LeagueSim.Api.Controllers
{

    [ApiController]
    [Route("api/League")]
    public class LeagueController : ControllerBase
    {
        private readonly ILeagueService _service;

        public LeagueController(ILeagueService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var league = _service.GetAll();
            return Ok(league);
        }
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var league = _service.GetById(id);
            if (league == null)
                return NotFound();

            return Ok(league);
        }

        [HttpPost]
        public IActionResult Add(League league)
        {
            _service.Add(league);
            return Ok(league);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, League league)
        {
            league.Id = id;
            _service.Update(league);
            return Ok(league);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _service.Delete(id);
            return Ok();
        }
    }
}
