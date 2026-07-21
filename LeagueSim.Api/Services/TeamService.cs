using LeagueSim.Api.Models;
using LeagueSim.Api.Repositories;

namespace LeagueSim.Api.Services
{
    public class TeamService : ITeamService
    {
        private readonly ITeamRepository _repository;

        public TeamService(ITeamRepository repository)
        {
            _repository = repository;
        }

        public List<Team> GetAll() => _repository.GetAll();
        public Team? GetById(int id) => _repository.GetById(id);
        public void Add(Team team)
        {
            if (string.IsNullOrWhiteSpace(team.Name))
                throw new ArgumentException("Takım adı boş olamaz!");

            _repository.Add(team);
        }
        public void Update(Team team) => _repository.Update(team);
        public void Delete(int id) => _repository.Delete(id);
    }
}
