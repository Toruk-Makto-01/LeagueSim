using LeagueSim.Api.Data;
using LeagueSim.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeagueSim.Api.Controllers
{
    [ApiController]
    [Route("api/Standing")]
    public class StandingController : ControllerBase
    {
        private readonly StandingService _standingService;
        private readonly LeagueSimContext _context; // <-- 1. _context değişkenini tanımlıyoruz

        public StandingController(StandingService standingService, LeagueSimContext context)
        {
            _standingService = standingService;
            _context = context;
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
            // 1. Önce ligdeki tüm maçları çekip hepsinin oynanıp oynanmadığını kontrol ediyoruz
            var allMatches = _context.Weeks
                .Where(w => w.LeagueId == leagueId)
                .SelectMany(w => w.Matches)
                .ToList();

            // Eğer hiç maç yoksa veya oynanmamış maçlar varsa sezon henüz bitmemiştir!
            if (!allMatches.Any() || allMatches.Any(m => !m.IsPlayed))
            {
                return NotFound("Lig henüz tamamlanmadı.");
            }

            // 2. Sezon bittiyse puan durumunu hesaplayıp 1. olanı şampiyon döndürüyoruz
            var standings = _standingService.GetStandings(leagueId);
            var champion = standings.FirstOrDefault();

            if (champion == null)
            {
                return NotFound("Puan tablosu oluşturulamadı.");
            }

            return Ok(new
            {
                Message = $"{leagueId} ID'li ligin sezon şampiyonu: ",
                ChampionTeam = champion.TeamName,
                Points = champion.Points,
                GoalDifference = champion.GoalDifference,
                GoalFor = champion.GoalsFor,
                Logo = champion.Logo // <-- Şampiyonun logosun
            });
        }
    }
}
