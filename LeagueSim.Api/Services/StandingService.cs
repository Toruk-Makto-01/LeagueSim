using LeagueSim.Api.Models;
using LeagueSim.Api.Repositories;

namespace LeagueSim.Api.Services
{
    public class StandingService
    {
        private readonly IMatchRepository _matchRepository;
        private readonly ITeamRepository _teamRepository;

        public StandingService(IMatchRepository matchRepository, ITeamRepository teamRepository)
        {
            _matchRepository = matchRepository;
            _teamRepository = teamRepository;
        }

        public List<StandingDto> GetStandings(int leagueId)
        {
            var teams = _teamRepository.GetAll();

            // İlgili ligde oynanmış maçları alıyoruz
            var matches = _matchRepository.GetAll()
                .Where(m => m.IsPlayed && m.Week != null && m.Week.LeagueId == leagueId)
                .ToList();

            var standings = new List<StandingDto>();

            foreach (var team in teams)
            {
                // Takımın ev sahibi veya deplasman olarak oynadığı maçları buluyoruz
                var teamMatches = matches
                    .Where(m => m.HomeTeamId == team.Id || m.AwayTeamId == team.Id)
                    .ToList();

                int played = teamMatches.Count;
                int won = 0, drawn = 0, lost = 0, goalsFor = 0, goalsAgainst = 0;

                foreach (var match in teamMatches)
                {
                    bool isHome = match.HomeTeamId == team.Id;

                    // int? (nullable) değerleri ?? 0 ile güvenli bir şekilde int'e çeviriyoruz
                    int teamScore = isHome ? (match.HomeScore ?? 0) : (match.AwayScore ?? 0);
                    int opponentScore = isHome ? (match.AwayScore ?? 0) : (match.HomeScore ?? 0);

                    goalsFor += teamScore;
                    goalsAgainst += opponentScore;

                    if (teamScore > opponentScore) won++;
                    else if (teamScore == opponentScore) drawn++;
                    else lost++;
                }

                standings.Add(new StandingDto
                {
                    TeamId = team.Id,
                    TeamName = team.Name,
                    LogoUrl = team.LogoUrl,
                    Played = played,
                    Won = won,
                    Drawn = drawn,
                    Lost = lost,
                    GoalsFor = goalsFor,
                    GoalsAgainst = goalsAgainst
                });
            }

            // Dokümandaki sıralama kuralı: Puan > Averaj > Atılan Gol
            return standings
                .OrderByDescending(s => s.Points)
                .ThenByDescending(s => s.GoalDifference)
                .ThenByDescending(s => s.GoalsFor)
                .ToList();
        }
    }
}