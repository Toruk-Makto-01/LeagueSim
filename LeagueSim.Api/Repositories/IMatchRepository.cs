using LeagueSim.Api.Models;

namespace LeagueSim.Api.Repositories
{
    public interface IMatchRepository
    {
        void Add(Match match);
        List<Match> GetByWeekId(int weekId);
        List<Match> GetAll();
        void Update(Match match);
    }
}
