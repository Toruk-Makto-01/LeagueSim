using LeagueSim.Api.Data;
using LeagueSim.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueSim.Api.Repositories
{
    public class LeagueRepository : ILeagueRepository
    {
        private readonly LeagueSimContext _context;

        public LeagueRepository(LeagueSimContext context)
        {
            _context = context;
        }
        public List<League> GetAll() => _context.Leagues.ToList();
        public League? GetById(int id) => _context.Leagues
            .Include(l => l.Weeks)
                .ThenInclude(w => w.Matches)
                    .ThenInclude(m => m.HomeTeam) // <-- Ev sahibi takımın adını dahil eder
            .Include(l => l.Weeks)
                .ThenInclude(w => w.Matches)
                    .ThenInclude(m => m.AwayTeam) // <-- Deplasman takımın adını dahil eder
            .FirstOrDefault(l => l.Id == id);
        public void Add(League league)
        {
            _context.Leagues.Add(league);
            _context.SaveChanges();
        }
        public void Update(League league)
        {
            _context.Leagues.Update(league);
            _context.SaveChanges();
        }
        public void Delete(int id)
        {
            var league = _context.Leagues.Find(id);
            if (league != null)
            {
                _context.Leagues.Remove(league);
                _context.SaveChanges();
            }
        }
    }
}
