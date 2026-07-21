using LeagueSim.Api.Data;
using LeagueSim.Api.Models;
using LeagueSim.Api.Repositories;

namespace LeagueSim.Api.Services
{
    public class FixtureService
    {
        // Fields for the repositories
        private readonly ITeamRepository _teamRepository;
        private readonly LeagueSimContext _context;

        // Constructor to inject the repositories
        public FixtureService(
            ITeamRepository teamRepository,
            LeagueSimContext context
            )
        {
            _teamRepository = teamRepository;
            _context = context;
        }

        // Method to generate fixture and save it to the database
        public void GenerateFixture(int leagueId)
        {
            var league = _context.Leagues.Find(leagueId);
            if (league == null)
            {
                throw new ArgumentException($"League with ID {leagueId} not found.");
            }

            // takımları veritabanından al
            var teams = _teamRepository.GetAll();

            // dummy kontrolu
            if (teams.Count % 2 != 0)
                teams.Add(new Team { Id = -1, Name = "BYE" });

            int teamCount = teams.Count;
            int roundCount = teamCount - 1;
            int matchesPerRound = teamCount / 2;

            var weeks = new List<Week>();
            var rotatingTeams = teams.Skip(1).ToList();

            // tek devre döngüsü
            for (int round = 0; round < roundCount; round++)
            {
                var week = new Week { WeekNumber = round + 1, League = league };
                var currentTeams = new List<Team> { teams[0] };
                currentTeams.AddRange(rotatingTeams);

                for (int i = 0; i < matchesPerRound; i++)
                {
                    var homeTeam = currentTeams[i];
                    var awayTeam = currentTeams[teamCount - 1 - i];

                    if (homeTeam.Id == -1 || awayTeam.Id == -1)
                        continue;

                    week.Matches.Add(new Match
                    {
                        HomeTeamId = homeTeam.Id,
                        AwayTeamId = awayTeam.Id,
                        IsPlayed = false
                    });
                }

                var last = rotatingTeams[rotatingTeams.Count - 1];
                rotatingTeams.RemoveAt(rotatingTeams.Count - 1);
                rotatingTeams.Insert(0, last);

                weeks.Add(week);
            }

            // rövanş döngüsü
            int firstLegCount = weeks.Count;
            for (int i = 0; i < firstLegCount; i++)
            {
                var firstLegWeek = weeks[i];
                var secondLegWeek = new Week
                {
                    WeekNumber = firstLegCount + i + 1,
                    League = league
                };

                foreach (var match in firstLegWeek.Matches)
                {
                    secondLegWeek.Matches.Add(new Match
                    {
                        HomeTeamId = match.AwayTeamId,
                        AwayTeamId = match.HomeTeamId,
                        IsPlayed = false
                    });
                }

                weeks.Add(secondLegWeek);
            }

            // veritabanına kaydet
            foreach (var week in weeks)
            {
                week.LeagueId = leagueId;
                _context.Weeks.Add(week);
            }
            _context.SaveChanges();
        }
    }
}