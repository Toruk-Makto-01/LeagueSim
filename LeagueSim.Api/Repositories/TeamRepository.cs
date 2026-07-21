using LeagueSim.Api.Data;
using LeagueSim.Api.Models;

namespace LeagueSim.Api.Repositories
{
    public class TeamRepository : ITeamRepository
    {
        private readonly LeagueSimContext _context;

        public TeamRepository(LeagueSimContext context)
        {
            _context = context;
        }
        public List<Team> GetAll() => _context.Teams.ToList();
        public Team? GetById(int id) => _context.Teams.Find(id);
        public void Add(Team team)
        {
            _context.Teams.Add(team);
            _context.SaveChanges();
        }
        public void Update(Team team)
        {
            _context.Teams.Update(team);
            _context.SaveChanges();
        }
        public void Delete(int id)
        {
            var team = _context.Teams.Find(id);
            if (team != null)
            {
                _context.Teams.Remove(team);
                _context.SaveChanges();
            }
        }
    }
}
