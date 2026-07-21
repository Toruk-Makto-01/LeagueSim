using LeagueSim.Api.Models;

namespace LeagueSim.Api.Repositories
{
    public interface ITeamRepository
    {
        List<Team> GetAll();
        Team? GetById(int id);
        void Add(Team team);
        void Update(Team team);
        void Delete(int id);
    }
}
