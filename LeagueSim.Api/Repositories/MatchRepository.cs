using LeagueSim.Api.Data;
using LeagueSim.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueSim.Api.Repositories
{
    public class MatchRepository : IMatchRepository
    {
        private readonly LeagueSimContext _context;
        public MatchRepository(LeagueSimContext context)
        {
            _context = context;
        }
        public void Add(Match match)
        {
            _context.Matches.Add(match);
            _context.SaveChanges();
        }
        public List<Match> GetByWeekId(int weekId)
        {
            return _context.Matches.Where(m => m.WeekId == weekId).ToList();
        }
        public List<Match> GetAll()
        {
            // return _context.Matches.ToList(); // Week ve League bilgileri buraya GELMEZ!

            // .Include ile ilişkili tabloları da çekebiliriz. Bu sayede Match nesnesi ile birlikte Week ve League bilgilerini de alabiliriz.
            return _context.Matches
                .Include(m => m.Week)
                .ThenInclude(w => w.League)
                .ToList();
        }
        public void Update(Match match)
        {
            _context.Matches.Update(match);
            _context.SaveChanges();
        }
    }
}
