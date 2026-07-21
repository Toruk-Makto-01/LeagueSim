using LeagueSim.Api.Data;
using LeagueSim.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueSim.Api.Repositories
{
    public class WeekRepository : IWeekRepository
    {
        private readonly LeagueSimContext _context;
        public WeekRepository(LeagueSimContext context)
        {
            _context = context;
        }
        public void Add(Week week)
        {
            _context.Weeks.Add(week);
            _context.SaveChanges();
        }
        public List<Week> GetByLeagueId(int leagueId)
        {
            return _context.Weeks.Where(w => w.LeagueId == leagueId).ToList();
        }

        public List<Week> GetAll()
        {
            return _context.Weeks.ToList();
        }

        public Week? GetById(int id)
        {
            return _context.Weeks
                .Include(w => w.Matches)
                .FirstOrDefault(w => w.Id == id);
        }

        public void Update(Week week)
        {
            _context.Weeks.Update(week);
            _context.SaveChanges();
        }
    }
}
