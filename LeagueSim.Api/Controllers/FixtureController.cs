using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LeagueSim.Api.Models;
using LeagueSim.Api.Data;
using LeagueSim.Api.Repositories;
using System.Linq;

namespace LeagueSim.Api.Controllers
{
    [ApiController]
    [Route("api/Fixture")]
    public class FixtureController : ControllerBase
    {
        private readonly LeagueSimContext _context;
        private readonly ITeamRepository _teamRepository;

        public FixtureController(LeagueSimContext context, ITeamRepository teamRepository)
        {
            _context = context;
            _teamRepository = teamRepository;
        }

        [HttpPost("{leagueId}")]
        public IActionResult GenerateFixture(int leagueId)
        {
            // Lig veritabanında yoksa otomatik oluştur (Foreign Key hatasını önler)
            var league = _context.Leagues.Find(leagueId);
            if (league == null)
            {
                _context.Leagues.Add(new League { Id = leagueId, Name = "Süper Lig" });
                _context.SaveChanges();
            }

            // 0. Yeni fikstür oluşturulurken tüm takımların moral değerlerini 50'ye sıfırlıyoruz
            var allTeams = _teamRepository.GetAll().ToList();
            foreach (var team in allTeams)
            {
                team.Morale = 50; // Moral değerini başlangıç seviyesine getiriyoruz
                _teamRepository.Update(team);
            }

            // 1. Eski hafta ve maçları temizleme (Artık üst üste binme olmayacak)
            var existingWeeks = _context.Weeks.Where(w => w.LeagueId == leagueId).ToList();
            if (existingWeeks.Any())
            {
                foreach (var week in existingWeeks)
                {
                    var matches = _context.Matches.Where(m => m.WeekId == week.Id).ToList();
                    _context.Matches.RemoveRange(matches);
                }
                _context.Weeks.RemoveRange(existingWeeks);
                _context.SaveChanges();
            }

            // Takımları çekip rastgele karıştırıyoruz ki her seferinde farklı fikstür çıksın
            var teams = _teamRepository.GetAll().OrderBy(t => Guid.NewGuid()).ToList();
            if (teams.Count < 18)
            {
                return BadRequest("Fikstür oluşturmak için en az 18 takım olmalıdır.");
            }

            var teamList = teams.Select(t => t.Id).ToList();
            int totalTeams = teamList.Count;
            int totalWeeks = (totalTeams - 1) * 2; // Çift devreli için toplam hafta (18 takım için 34 hafta)
            int halfWeeks = totalTeams - 1;

            // İlk Yarı Fikstür Üretme Döngüsü (Round-Robin)
            for (int weekIndex = 0; weekIndex < halfWeeks; weekIndex++)
            {
                var week = new Week
                {
                    LeagueId = leagueId,
                    WeekNumber = weekIndex + 1,
                    IsPlayed = false
                };
                _context.Weeks.Add(week);
                _context.SaveChanges();

                for (int i = 0; i < totalTeams / 2; i++)
                {
                    int homeIndex = (weekIndex + i) % (totalTeams - 1);
                    int awayIndex = (totalTeams - 1 - i + weekIndex) % (totalTeams - 1);

                    if (i == 0)
                    {
                        awayIndex = totalTeams - 1;
                    }

                    int homeTeamId = teamList[homeIndex];
                    int awayTeamId = teamList[awayIndex];

                    var match = new Match
                    {
                        WeekId = week.Id,
                        HomeTeamId = homeTeamId,
                        AwayTeamId = awayTeamId,
                        IsPlayed = false
                    };
                    _context.Matches.Add(match);
                }
                _context.SaveChanges();
            }

            // İkinci Yarı (Rövanşlar - Ev sahibi ve deplasmanlar yer değiştirir)
            for (int weekIndex = 0; weekIndex < halfWeeks; weekIndex++)
            {
                int secondHalfWeekNumber = halfWeeks + weekIndex + 1;
                var week = new Week
                {
                    LeagueId = leagueId,
                    WeekNumber = secondHalfWeekNumber,
                    IsPlayed = false
                };
                _context.Weeks.Add(week);
                _context.SaveChanges();

                var firstHalfWeek = _context.Weeks.Include(w => w.Matches).FirstOrDefault(w => w.LeagueId == leagueId && w.WeekNumber == weekIndex + 1);
                if (firstHalfWeek != null)
                {
                    foreach (var oldMatch in firstHalfWeek.Matches)
                    {
                        var returnMatch = new Match
                        {
                            WeekId = week.Id,
                            HomeTeamId = oldMatch.AwayTeamId, // Ev sahibi ile deplasman yer değiştiriyor
                            AwayTeamId = oldMatch.HomeTeamId,
                            IsPlayed = false
                        };
                        _context.Matches.Add(returnMatch);
                    }
                    _context.SaveChanges();
                }
            }

            return Ok("Çift devreli lig fikstürü başarıyla oluşturuldu.");
        }
    }
}