using LeagueSim.Api.Models;

namespace LeagueSim.Api.Repositories
{
    public interface ILeagueRepository
    {
        List<League> GetAll();
        League? GetById(int id);
        void Add(League league);
        void Update(League league);
        void Delete(int id);
    }
}
