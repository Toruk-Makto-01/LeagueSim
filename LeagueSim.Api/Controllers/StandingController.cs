using Microsoft.AspNetCore.Mvc;
using LeagueSim.Api.Services;

namespace LeagueSim.Api.Controllers
{
    [ApiController]
    [Route("api/Standing")]
    public class StandingController : ControllerBase
    {
        private readonly StandingService _standingService;

        public StandingController(StandingService standingService)
        {
            _standingService = standingService;
        }

        // Belirli bir ligin puan dumumunu kurala göre (puan > Averaj> Atılan Gol)
        [HttpGet("{leagueId}")]
        public IActionResult GetStanding(int leagueId)
        {
            var standings = _standingService.GetStandings(leagueId);
            return Ok(standings);
        }

        // Sezon sonunda şampiyonu gösterir
        [HttpGet("champion/{leagueId}")]
        public IActionResult GetChampion(int leagueId)
        {
            var standings = _standingService.GetStandings(leagueId);
            var champion = standings.FirstOrDefault();

            if (champion == null)
            {
                return NotFound("Lig henuz tamamlanmadı.");
            }

            return Ok(new
            {
                Message = $"{leagueId} ID'li ligin sezon şampiyonu: ",
                ChampionTeam = champion.TeamName,
                Points = champion.Points,
                GoalDifference = champion.GoalDifference,
                GoalFor = champion.GoalsFor
            });
        }
    }
}
