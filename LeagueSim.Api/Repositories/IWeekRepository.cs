using LeagueSim.Api.Models;

namespace LeagueSim.Api.Repositories
{
    public interface IWeekRepository
    {
        void Add(Week week);
        List<Week> GetByLeagueId(int leagueId);
        List<Week> GetAll();
        Week? GetById(int id);
        void Update(Week week);
    }
}
