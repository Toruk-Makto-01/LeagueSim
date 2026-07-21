using LeagueSim.Api.Models;
using LeagueSim.Api.Services;
using LeagueSim.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace LeagueSim.Api.Controllers
{

    [ApiController]
    [Route("api/Team")]
    public class TeamController : ControllerBase
    {
        private readonly ITeamService _service;
        private readonly ITeamRepository _teamRepository;

        public TeamController(ITeamService service, ITeamRepository teamRepository)
        {
            _service = service;
            _teamRepository = teamRepository;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var teams = _service.GetAll();
            return Ok(teams);
        }
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var team = _service.GetById(id);
            if (team == null)
                return NotFound();

            return Ok(team);
        }

        [HttpPost]
        public IActionResult Add(Team team)
        {
            _service.Add(team);
            return Ok(team);
        }

        [HttpPost("reset-morales")]
        public IActionResult ResetMorales()
        {
            var teams = _teamRepository.GetAll();
            foreach (var team in teams)
            {
                team.Morale = 50; // Herkesin moralini eşitle
                _teamRepository.Update(team);
            }

            return Ok("Tüm takımların morali yeni sezon için 50'ye sıfırlandı!");
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Team team)
        {
            team.Id = id; // route'tan gelen id'yi nesneye atıyor
            _service.Update(team); // team.Id ? Body'den gelen değer
            return Ok(team);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _service.Delete(id);
            return Ok();
        }
    }
}
