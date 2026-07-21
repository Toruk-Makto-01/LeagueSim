using LeagueSim.Api.Models;

namespace LeagueSim.Api.Services
{
    public interface ILeagueService
    {
        List<League> GetAll();
        League? GetById(int id);
        void Add(League league);
        void Update(League league);
        void Delete(int id);
    }
}
