using LeagueSim.Api.Models;
using LeagueSim.Api.Repositories;

namespace LeagueSim.Api.Services
{
    public class LeagueService : ILeagueService
    {
        private readonly ILeagueRepository _repository;

        public LeagueService(ILeagueRepository repository)
        {
            _repository = repository;
        }

        public List<League> GetAll() => _repository.GetAll();
        public League? GetById(int id) => _repository.GetById(id);
        public void Add(League league)
        {
            if (string.IsNullOrWhiteSpace(league.Name))
                throw new ArgumentException("Lig Adı boş olamaz!");

            _repository.Add(league);
        }
        public void Update(League league) => _repository.Update(league);
        public void Delete(int id) => _repository.Delete(id);
    }
}
